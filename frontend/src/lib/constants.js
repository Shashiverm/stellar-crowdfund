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

export const isContractActive = (id = getActiveContractId()) => Boolean(id) && id.length > 20;
export const CONTRACT_ACTIVE = isContractActive();
export const CONTRACT_ID_DISPLAY = CONTRACT_ACTIVE ? getActiveContractId() : 'Set VITE_CONTRACT_ID in .env';
