import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { ErrorType } from '@/lib/errors';
import Spinner from '@/components/ui/Spinner';
import ParticleBurst from '@/components/ui/ParticleBurst';

export default function TxStatus({ state, onRetry }) {
  if (state.status === 'idle') return null;
  if (state.status === 'pending') {
    return <div className="flex items-center gap-3 rounded-2xl border border-[rgba(0,229,255,0.15)] bg-white/5 p-4"><Spinner /><div>Waiting for wallet signature...</div></div>;
  }
  if (state.status === 'confirming') {
    return <div className="flex items-center gap-3 rounded-2xl border border-[rgba(57,255,20,0.15)] bg-white/5 p-4"><Spinner /><div>Confirming on-chain...</div></div>;
  }
  if (state.status === 'success') {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(57,255,20,0.2)] bg-[rgba(57,255,20,0.08)] p-4">
        <div className="absolute right-2 top-2"><ParticleBurst /></div>
        <div className="flex items-center gap-2 text-[var(--accent-aurora)]"><CheckCircle2 /> Donation confirmed</div>
        <div className="mt-2 text-sm text-[var(--text-secondary)]">Hash: {state.hash}</div>
      </div>
    );
  }

  const errorCopy = {
    [ErrorType.WALLET_NOT_FOUND]: { title: 'Wallet extension not installed', icon: <AlertTriangle />, tone: 'text-[var(--accent-plasma)]' },
    [ErrorType.USER_REJECTED]: { title: 'Transaction rejected in wallet', icon: <XCircle />, tone: 'text-[var(--text-secondary)]' },
    [ErrorType.INSUFFICIENT_BALANCE]: { title: 'Insufficient balance for this donation', icon: <AlertTriangle />, tone: 'text-red-300' },
    default: { title: 'Donation failed', icon: <AlertTriangle />, tone: 'text-red-300' },
  }[state.errorType] || { title: 'Donation failed', icon: <AlertTriangle />, tone: 'text-red-300' };

  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-4 ${state.errorType === ErrorType.INSUFFICIENT_BALANCE ? 'error-shake' : ''}`}>
      <div className={`flex items-center gap-2 ${errorCopy.tone}`}>{errorCopy.icon}<span>{errorCopy.title}</span></div>
      <div className="mt-2 text-sm text-[var(--text-secondary)]">{state.message}</div>
      {onRetry ? <button className="mt-3 rounded-full border border-[rgba(0,229,255,0.18)] px-4 py-2 text-sm" onClick={onRetry}>Try again</button> : null}
    </div>
  );
}