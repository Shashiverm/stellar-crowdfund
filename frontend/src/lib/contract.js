import * as StellarSdk from '@stellar/stellar-sdk';
import { CONTRACT_ACTIVE, CONTRACT_ID, DEMO_ACCOUNT, DEMO_CAMPAIGN, DEMO_DONATIONS, NETWORK_PASSPHRASE, SOROBAN_RPC } from './constants';

function createRpcClient() {
  const rpcNamespace = StellarSdk.rpc || StellarSdk.SorobanRpc;
  const Server = rpcNamespace?.Server;
  if (!Server) return null;
  return new Server(SOROBAN_RPC, { allowHttp: SOROBAN_RPC.startsWith('http://') });
}

const rpc = createRpcClient();

function toXlm(stroops) {
  return Number(stroops || 0) / 1e7;
}

function toStroops(xlm) {
  return BigInt(Math.round(Number(xlm || 0) * 1e7));
}

function parseDonorEntry(entry, index) {
  return {
    donor: entry.donor || entry[0] || 'GDEMO',
    amount: entry.amount || entry[1] || 0,
    timestamp: entry.timestamp || entry[2] || Date.now() - index * 60000,
    txHash: entry.txHash || entry.hash || `demo-${index}`,
  };
}

async function buildSimulationTx(method, args = []) {
  const account = new StellarSdk.Account(StellarSdk.Keypair.random().publicKey(), '0');
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const operation = contract.call(method, ...args);
  return new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  }).addOperation(operation).setTimeout(30).build();
}

async function simulate(method, args = []) {
  if (!CONTRACT_ACTIVE || !rpc) return null;
  const tx = await buildSimulationTx(method, args);
  return rpc.simulateTransaction(tx);
}

export async function getCampaign() {
  if (!CONTRACT_ACTIVE) {
    return { ...DEMO_CAMPAIGN, goal: toXlm(DEMO_CAMPAIGN.goal), raised: toXlm(DEMO_CAMPAIGN.raised) };
  }
  try {
    const result = await simulate('get_campaign');
    const parsed = StellarSdk.scValToNative ? StellarSdk.scValToNative(result?.retval) : result?.retval;
    return {
      title: parsed.title || parsed[0] || DEMO_CAMPAIGN.title,
      goal: toXlm(parsed.goal || parsed[1] || DEMO_CAMPAIGN.goal),
      raised: toXlm(parsed.raised || parsed[2] || DEMO_CAMPAIGN.raised),
      donor_count: Number(parsed.donor_count || parsed[4] || DEMO_CAMPAIGN.donor_count),
      owner: parsed.owner || parsed[3] || DEMO_CAMPAIGN.owner,
    };
  } catch {
    return { ...DEMO_CAMPAIGN, goal: toXlm(DEMO_CAMPAIGN.goal), raised: toXlm(DEMO_CAMPAIGN.raised) };
  }
}

export async function getDonations() {
  if (!CONTRACT_ACTIVE) return DEMO_DONATIONS.map(parseDonorEntry);
  try {
    const result = await simulate('get_donations');
    const native = StellarSdk.scValToNative ? StellarSdk.scValToNative(result?.retval) : result?.retval;
    return (native || []).map((entry, index) => parseDonorEntry(entry, index));
  } catch {
    return DEMO_DONATIONS.map(parseDonorEntry);
  }
}

export async function getContractEvents() {
  if (!CONTRACT_ACTIVE || !rpc) {
    return DEMO_DONATIONS.map((donation) => ({ ...donation, amount: toXlm(donation.amount) }));
  }
  try {
    const events = await rpc.getEvents({
      startLedger: Math.max(0, (await rpc.getLatestLedger()).sequence - 2000),
      filters: [{ contractIds: [CONTRACT_ID] }],
    });
    return (events?.events || []).map((event, index) => ({
      donor: event.topic?.[1] || event.id || 'GDEMO',
      amount: toXlm(event.value || 0),
      timestamp: new Date(event.createdAt || Date.now()).getTime(),
      txHash: event.ledgerClosedAt || event.id || `event-${index}`,
    }));
  } catch {
    return DEMO_DONATIONS.map((donation) => ({ ...donation, amount: toXlm(donation.amount) }));
  }
}

export async function donateToCampaign({ publicKey, amount, signTransaction }) {
  if (!CONTRACT_ACTIVE || !rpc) {
    return { hash: `demo-${Date.now()}`, success: true };
  }
  const account = await rpc.getAccount(publicKey);
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call('donate', StellarSdk.nativeToScVal(publicKey, { type: 'address' }), StellarSdk.nativeToScVal(toStroops(amount), { type: 'i128' })))
    .setTimeout(30)
    .build();

  const prepared = await rpc.prepareTransaction(tx);
  const signedXdr = await signTransaction(prepared.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  return rpc.sendTransaction(signedTx);
}

export { rpc, toXlm, toStroops };