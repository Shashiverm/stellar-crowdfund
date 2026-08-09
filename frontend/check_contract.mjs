import * as StellarSdk from '@stellar/stellar-sdk';

async function main() {
  const contractId = 'CBJ3A3Z3INDIAHRBVQUEFDODP4MI6U3EOANG2DRRCT5JSOAKYBQ34MS5';
  const rpc = new StellarSdk.SorobanRpc.Server('https://soroban-testnet.stellar.org');
  const contract = new StellarSdk.Contract(contractId);
  const account = new StellarSdk.Account(StellarSdk.Keypair.random().publicKey(), '0');
  
  try {
    const operation = contract.call('get_campaign');
    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: 'Test SDF Network ; September 2015',
    }).addOperation(operation).setTimeout(30).build();
    
    const res = await rpc.simulateTransaction(tx);
    if (StellarSdk.rpc?.Api?.isSimulationError(res)) {
        console.log("Simulation error:", res.error);
    } else {
        console.log("Campaign Data:", JSON.stringify(StellarSdk.scValToNative(res.retval)));
    }
  } catch (e) {
    console.error("Error calling get_campaign:", e.message);
  }
}

main();
