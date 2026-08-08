import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '@/components/ui/GlassCard';
import DonateForm from '@/components/donate/DonateForm';
import TxStatus from '@/components/donate/TxStatus';
import WalletModal from '@/components/wallet/WalletModal';
import { useDonate } from '@/hooks/useDonate';

export default function Donate() {
  const wallet = useOutletContext();
  const donation = useDonate(wallet);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!wallet.publicKey) {
      toast('Connect a wallet to donate.');
    }
  }, [wallet.publicKey]);

  if (!wallet.publicKey) {
    return (
      <div className="mx-auto max-w-xl">
        <GlassCard>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-[rgba(0,229,255,0.3)] bg-[rgba(0,229,255,0.08)] text-[var(--accent-cyan)] shadow-[0_0_30px_rgba(0,229,255,0.2)] animate-pulse">
              <Wallet size={32} />
            </div>
            <h2 className="font-['Orbitron'] text-xl font-bold tracking-[0.16em] text-[var(--text-primary)]">Wallet Disconnected</h2>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-[var(--text-secondary)]">
              Connect your Stellar wallet module to begin the donation sequence and sign Soroban smart contract transactions.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="glow-button mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              <Wallet size={16} />
              Connect Wallet
            </button>
          </div>
        </GlassCard>
        <WalletModal 
          open={modalOpen} 
          wallets={wallet.wallets} 
          connecting={wallet.connecting} 
          onSelect={async (walletId) => { 
            await wallet.connect(walletId); 
            setModalOpen(false); 
          }} 
          onClose={() => setModalOpen(false)} 
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <GlassCard>
        <div className="mb-4 font-['Orbitron'] text-2xl tracking-[0.18em]">Launch donation</div>
        <DonateForm onSubmit={donation.submit} loading={donation.state.status === 'pending' || donation.state.status === 'confirming'} />
      </GlassCard>
      <TxStatus state={donation.state} onRetry={() => donation.setState({ status: 'idle', hash: '', errorType: '', message: '' })} />
    </div>
  );
}