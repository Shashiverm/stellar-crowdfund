import { useEffect, useMemo, useState } from 'react';
import {
  isConnected,
  requestAccess,
  getAddress,
  signTransaction as freighterSignTx,
  isAllowed,
} from '@stellar/freighter-api';
import { ErrorType, classifyError } from '@/lib/errors';
import { NETWORK_PASSPHRASE } from '@/lib/constants';

const defaultWallets = [
  { id: 'freighter', name: 'Freighter', recommended: true },
  { id: 'xbull', name: 'xBull' },
  { id: 'lobstr', name: 'Lobstr' },
];

export function useWallet() {
  const [publicKey, setPublicKey] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [wallets] = useState(defaultWallets);
  const [isFreighterInstalled, setIsFreighterInstalled] = useState(false);
  const [kit, setKit] = useState(null);

  // Check if Freighter is installed and auto-reconnect if previously authorized
  useEffect(() => {
    let mounted = true;

    async function checkFreighterState() {
      try {
        const connRes = await isConnected();
        const installed = typeof connRes === 'boolean' ? connRes : Boolean(connRes?.isConnected);
        if (mounted) {
          setIsFreighterInstalled(installed);
        }

        const savedWallet = localStorage.getItem('stellarfund_wallet_connected');
        if (installed && savedWallet === 'freighter') {
          const allowedRes = await isAllowed();
          const allowed = typeof allowedRes === 'boolean' ? allowedRes : Boolean(allowedRes?.isAllowed);
          if (allowed) {
            const addrRes = await getAddress();
            const address = typeof addrRes === 'string' ? addrRes : addrRes?.address;
            if (address && mounted) {
              setPublicKey(address);
            }
          }
        } else if (savedWallet === 'mock') {
          if (mounted) setPublicKey('GDMOCKWALLETADDRESS0000000000000000000000000000000000');
        }
      } catch (err) {
        console.warn('Freighter status check failed:', err);
      }
    }

    checkFreighterState();

    import('@creit.tech/stellar-wallets-kit')
      .then((module) => {
        if (!mounted) return;
        const api = module.default || module;
        setKit(api);
      })
      .catch(() => {
        if (mounted) setKit(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const connect = async (walletId = 'freighter') => {
    setConnecting(true);
    setError(null);
    setErrorType(null);

    try {
      if (walletId === 'freighter') {
        const connRes = await isConnected();
        const installed = typeof connRes === 'boolean' ? connRes : Boolean(connRes?.isConnected);
        
        if (!installed) {
          const notFoundErr = new Error(
            'Freighter extension is not installed in your browser. Please install Freighter from freighter.app to connect.'
          );
          setError(notFoundErr);
          setErrorType(ErrorType.WALLET_NOT_FOUND);
          throw notFoundErr;
        }

        // Prompt user for wallet authorization in Freighter extension
        const accessRes = await requestAccess();
        let address = '';
        if (typeof accessRes === 'string') {
          address = accessRes;
        } else if (accessRes && accessRes.address) {
          address = accessRes.address;
        } else if (accessRes && accessRes.error) {
          throw new Error(typeof accessRes.error === 'string' ? accessRes.error : 'Wallet connection request was rejected.');
        }

        if (!address) {
          const addrRes = await getAddress();
          address = typeof addrRes === 'string' ? addrRes : addrRes?.address;
        }

        if (!address) {
          throw new Error('Could not retrieve public key address from Freighter.');
        }

        setPublicKey(address);
        localStorage.setItem('stellarfund_wallet_connected', 'freighter');
        return address;
      }

      if (walletId === 'mock') {
        const mockAddr = 'GDMOCKWALLETADDRESS0000000000000000000000000000000000';
        setPublicKey(mockAddr);
        localStorage.setItem('stellarfund_wallet_connected', 'mock');
        return mockAddr;
      }

      // Fallback via stellar-wallets-kit for other wallets (e.g. xBull, Lobstr)
      if (kit) {
        if (kit.setWallet) {
          await kit.setWallet(walletId);
        } else if (kit.openModal) {
          await kit.openModal();
        }

        let address = '';
        if (typeof kit.getAddress === 'function') {
          address = await kit.getAddress();
        } else if (typeof kit.getPublicKey === 'function') {
          address = await kit.getPublicKey();
        } else {
          address = kit.address || kit.publicKey || '';
        }

        if (address) {
          setPublicKey(address);
          localStorage.setItem('stellarfund_wallet_connected', walletId);
          return address;
        }
      }

      throw new Error(`Wallet provider "${walletId}" is not currently supported.`);
    } catch (cause) {
      const type = classifyError(cause);
      setErrorType(type);
      setError(cause instanceof Error ? cause : new Error(String(cause)));
      throw cause;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    setPublicKey('');
    setError(null);
    setErrorType(null);
    localStorage.removeItem('stellarfund_wallet_connected');
    if (kit?.disconnect) {
      try {
        await kit.disconnect();
      } catch {
        /* noop */
      }
    }
  };

  const signTransaction = async (xdr, options = {}) => {
    try {
      setError(null);
      setErrorType(null);

      const savedWallet = localStorage.getItem('stellarfund_wallet_connected');
      if (savedWallet === 'freighter' || (publicKey && !publicKey.startsWith('GDMOCK'))) {
        const res = await freighterSignTx(xdr, {
          networkPassphrase: options.networkPassphrase || NETWORK_PASSPHRASE,
          address: publicKey,
        });

        if (typeof res === 'string') return res;
        if (res && res.error) {
          throw new Error(typeof res.error === 'string' ? res.error : 'Transaction signing was rejected in Freighter.');
        }
        if (res && res.signedTxXdr) {
          return res.signedTxXdr;
        }
        if (res && res.xdr) {
          return res.xdr;
        }
      }

      if (kit) {
        const signer = kit.signTransaction || kit.signAndSendTransaction;
        if (signer) {
          const result = await signer.call(kit, xdr, {
            networkPassphrase: NETWORK_PASSPHRASE,
            ...options,
          });
          return result?.signedTxXdr || result?.xdr || result?.signedXdr || result || xdr;
        }
      }

      return xdr;
    } catch (cause) {
      const type = classifyError(cause);
      setErrorType(type);
      setError(cause instanceof Error ? cause : new Error(String(cause)));
      throw cause;
    }
  };

  return useMemo(
    () => ({
      publicKey,
      connecting,
      error,
      errorType,
      wallets,
      isFreighterInstalled,
      connect,
      disconnect,
      signTransaction,
    }),
    [publicKey, connecting, error, errorType, wallets, isFreighterInstalled]
  );
}