import * as StellarSdk from '@stellar/stellar-sdk';
import { getActiveContractId, HORIZON, isContractActive, NETWORK_PASSPHRASE, SOROBAN_RPC } from './constants';


function createRpcClient() {
  try {
    const rpcNamespace = StellarSdk.rpc || StellarSdk.SorobanRpc;
    const Server = rpcNamespace?.Server;
    if (!Server) return null;
    return new Server(SOROBAN_RPC, { allowHttp: SOROBAN_RPC.startsWith('http://') });
  } catch {
    return null;
  }
}

const rpc = createRpcClient();

export async function checkRpcPing() {
  if (!rpc) return false;
  try {
    const status = await rpc.getHealth();
    return status?.status === 'healthy';
  } catch {
    return false;
  }
}

function toXlm(stroops) {
  try {
    return Number(BigInt(stroops || 0)) / 1e7;
  } catch {
    return Number(stroops || 0) / 1e7;
  }
}

function toStroops(xlm) {
  return BigInt(Math.round(Number(xlm || 0) * 1e7));
}

function parseDonorEntry(entry, index) {
  if (!entry) {
    return {
      donor: 'Unknown',
      amount: 0,
      timestamp: Date.now() - index * 60000,
      txHash: `tx-${index}`,
    };
  }
  return {
    donor: entry.donor || entry[0] || 'Unknown',
    amount: entry.amount !== undefined ? toXlm(entry.amount) : (entry[1] ? toXlm(entry[1]) : 0),
    timestamp: Number(entry.timestamp || entry[2] || (Date.now() - index * 60000)),
    txHash: entry.txHash || entry.hash || `tx-${index}`,
  };
}

async function buildSimulationTx(contractId, method, args = []) {
  const account = new StellarSdk.Account(StellarSdk.Keypair.random().publicKey(), '0');
  const contract = new StellarSdk.Contract(contractId);
  const operation = contract.call(method, ...args);
  return new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  }).addOperation(operation).setTimeout(30).build();
}

async function simulate(method, args = []) {
  const contractId = getActiveContractId();
  if (!isContractActive(contractId) || !rpc) return null;
  try {
    const tx = await buildSimulationTx(contractId, method, args);
    return await rpc.simulateTransaction(tx);
  } catch (err) {
    console.warn(`Simulation failed for ${method}:`, err);
    return null;
  }
}

export async function getCampaign() {
  const contractId = getActiveContractId();
  if (!isContractActive(contractId)) {
    throw new Error('Contract is not active');
  }
  try {
    const result = await simulate('get_campaign');
    if (!result || StellarSdk.rpc?.Api?.isSimulationError(result)) {
      throw new Error('Simulation failed');
    }
    const native = StellarSdk.scValToNative ? StellarSdk.scValToNative(result?.retval) : result?.retval;
    if (!native) throw new Error('No campaign data');
    return {
      title: native.title || native[0] || 'Campaign',
      goal: toXlm(native.goal !== undefined ? native.goal : native[1] || 0),
      raised: toXlm(native.raised !== undefined ? native.raised : native[2] || 0),
      donor_count: Number(native.donor_count !== undefined ? native.donor_count : native[4] || 0),
      owner: native.owner || native[3] || 'Unknown',
      isDemo: false,
    };
  } catch (err) {
    console.error('getCampaign error:', err);
    throw err;
  }
}

export async function getDonations() {
  const contractId = getActiveContractId();
  if (!isContractActive(contractId)) return [];
  try {
    const result = await simulate('get_donations');
    if (!result || StellarSdk.rpc?.Api?.isSimulationError(result)) {
      return [];
    }
    const native = StellarSdk.scValToNative ? StellarSdk.scValToNative(result?.retval) : result?.retval;
    if (!Array.isArray(native)) return [];
    return native.map((entry, index) => parseDonorEntry(entry, index));
  } catch (err) {
    console.error('getDonations error:', err);
    return [];
  }
}

export async function getContractEvents() {
  const contractId = getActiveContractId();
  if (!isContractActive(contractId) || !rpc) {
    return [];
  }
  try {
    const latestLedger = await rpc.getLatestLedger();
    const events = await rpc.getEvents({
      startLedger: Math.max(0, (latestLedger?.sequence || 1000) - 5000),
      filters: [{ contractIds: [contractId] }],
    });
    if (!events?.events?.length) {
      return [];
    }
    return events.events.map((event, index) => {
      const valueNative = StellarSdk.scValToNative ? StellarSdk.scValToNative(event.value) : event.value;
      const topicNative = (event.topic || []).map((t) => (StellarSdk.scValToNative ? StellarSdk.scValToNative(t) : t));
      return {
        donor: String(topicNative?.[1] || event.id || 'Unknown Donor'),
        amount: toXlm(typeof valueNative === 'number' || typeof valueNative === 'bigint' ? valueNative : 0),
        timestamp: event.ledgerClosedAt ? new Date(event.ledgerClosedAt).getTime() : Date.now() - index * 60000,
        txHash: event.txHash || event.id || `event-${index}`,
      };
    });
  } catch (err) {
    console.warn('Failed to fetch events from RPC:', err);
    return [];
  }
}

export async function donateToCampaign({ publicKey, amount, signTransaction }) {
  const contractId = getActiveContractId();
  if (!isContractActive(contractId) || !rpc) {
    throw new Error('Contract is not active or RPC is down');
  }
  const account = await rpc.getAccount(publicKey);
  const contract = new StellarSdk.Contract(contractId);
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'donate',
        StellarSdk.nativeToScVal(publicKey, { type: 'address' }),
        StellarSdk.nativeToScVal(toStroops(amount), { type: 'i128' })
      )
    )
    .setTimeout(30)
    .build();

  const prepared = await rpc.prepareTransaction(tx);
  const signedXdr = await signTransaction(prepared.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  return rpc.sendTransaction(signedTx);
}

export { rpc, toXlm, toStroops };