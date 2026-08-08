import * as StellarSdk from '@stellar/stellar-sdk';

export function getActiveContractId() {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('stellar_custom_contract_id');
    if (custom && custom.trim()) return custom.trim();
  }
  return (import.meta.env.VITE_CONTRACT_ID || '').trim();
}

export const CONTRACT_ID = getActiveContractId();
export const NETWORK_PASSPHRASE = StellarSdk.Networks?.TESTNET || 'Test SDF Network ; September 2015';
export const SOROBAN_RPC = import.meta.env.VITE_SOROBAN_RPC || 'https://soroban-testnet.stellar.org';
export const HORIZON = import.meta.env.VITE_HORIZON || 'https://horizon-testnet.stellar.org';
export const DEMO_ACCOUNT = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';

export const isContractActive = (id = getActiveContractId()) => Boolean(id) && id.length > 20 && !id.startsWith('CDEMO');
export const CONTRACT_ACTIVE = isContractActive();
export const CONTRACT_ID_DISPLAY = CONTRACT_ACTIVE ? getActiveContractId() : 'Set VITE_CONTRACT_ID in .env or UI';

export const DEMO_CAMPAIGN = {
  title: 'Deep Space Habitat Relay',
  goal: 1200000000,
  raised: 742500000,
  donor_count: 48,
  owner: 'GD5F3V6M4D4K5G7GJ6H4M5L2N4C5R6T7U8V9W0X1Y2Z3A4B5C6D7E8F9',
};

export const DEMO_DONATIONS = [
  { donor: 'GCVB4B6L5D4S5F6G7H8J9K0L1M2N3B4V5C6X7Z8A9S0D1F2G3H4J5K6', amount: 50000000, timestamp: Date.now() - 65000, txHash: 'demo-hash-01' },
  { donor: 'GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCK', amount: 100000000, timestamp: Date.now() - 240000, txHash: 'demo-hash-02' },
  { donor: 'GCCCCCVCVCVCVCVCVCVCVCVCVCVCVCVCVCVCVCVCVCVCVCVCVCVCC', amount: 12500000, timestamp: Date.now() - 510000, txHash: 'demo-hash-03' },
];