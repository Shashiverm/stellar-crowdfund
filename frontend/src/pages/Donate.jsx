import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import GlassCard from '@/components/ui/GlassCard';
import DonateForm from '@/components/donate/DonateForm';
import TxStatus from '@/components/donate/TxStatus';
import { useDonate } from '@/hooks/useDonate';

export default function Donate() {
  const wallet = useOutletContext();
  const donation = useDonate(wallet);

  useEffect(() => {
    if (!wallet.publicKey) {
      toast('Connect a wallet to donate.');
    }
  }, [wallet.publicKey]);

  if (!wallet.publicKey) {
    return <GlassCard><div className="text-center text-[var(--text-secondary)]">Connect a wallet to begin the donation sequence.</div></GlassCard>;
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