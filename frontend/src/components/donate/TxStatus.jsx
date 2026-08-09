import { AlertTriangle, CheckCircle2, ExternalLink, RefreshCw, XCircle } from 'lucide-react';
import { ErrorType } from '@/lib/errors';
import Spinner from '@/components/ui/Spinner';
import ParticleBurst from '@/components/ui/ParticleBurst';

export default function TxStatus({ state, onRetry }) {
  if (state.status === 'idle') return null;

  if (state.status === 'pending') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-[rgba(0,229,255,0.25)] bg-[rgba(0,229,255,0.06)] p-4 shadow-[0_0_20px_rgba(0,229,255,0.1)]">
        <Spinner />
        <div>
          <div className="font-['Orbitron'] text-xs font-bold tracking-[0.18em] text-[var(--accent-cyan)]">AWAITING WALLET SIGNATURE</div>
          <div className="mt-0.5 text-xs text-[var(--text-secondary)]">Confirm the Soroban transaction prompt in your wallet.</div>
        </div>
      </div>
    );
  }

  if (state.status === 'confirming') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-[rgba(57,255,20,0.25)] bg-[rgba(57,255,20,0.06)] p-4 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
        <Spinner />
        <div>
          <div className="font-['Orbitron'] text-xs font-bold tracking-[0.18em] text-[var(--accent-aurora)]">TRANSMITTING TO SOROBAN RPC</div>
          <div className="mt-0.5 text-xs text-[var(--text-secondary)]">Simulating footprint and broadcasting to Stellar Testnet ledger...</div>
        </div>
      </div>
    );
  }

  if (state.status === 'success') {
    const isRealHash = !!state.hash;
    return (
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(57,255,20,0.3)] bg-[rgba(57,255,20,0.08)] p-5 shadow-[0_0_30px_rgba(57,255,20,0.15)]">
        <div className="absolute right-2 top-2"><ParticleBurst /></div>
        <div className="flex items-center gap-2 font-['Orbitron'] text-sm font-bold tracking-widest text-[var(--accent-aurora)]">
          <CheckCircle2 size={18} /> DONATION CONFIRMED ON LEDGER
        </div>
        <div className="mt-2 font-['IBM_Plex_Mono'] text-xs text-[var(--text-secondary)] break-all">
          Hash: <span className="text-[var(--text-primary)]">{state.hash}</span>
        </div>

        {isRealHash ? (
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${state.hash}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[rgba(57,255,20,0.3)] bg-[rgba(57,255,20,0.1)] px-4 py-1.5 font-['Orbitron'] text-xs uppercase tracking-wider text-[var(--accent-aurora)] hover:bg-[rgba(57,255,20,0.2)]"
          >
            <span>View on Stellar Expert Explorer</span> <ExternalLink size={12} />
          </a>
        ) : null}
      </div>
    );
  }

  const errorCopy = {
    [ErrorType.WALLET_NOT_FOUND]: { title: 'Wallet Extension Missing', icon: <AlertTriangle size={18} />, tone: 'text-[var(--accent-plasma)]' },
    [ErrorType.USER_REJECTED]: { title: 'Transaction Cancelled in Wallet', icon: <XCircle size={18} />, tone: 'text-[var(--text-secondary)]' },
    [ErrorType.INSUFFICIENT_BALANCE]: { title: 'Insufficient Balance for Donation', icon: <AlertTriangle size={18} />, tone: 'text-red-400' },
    default: { title: 'Donation Transmission Failed', icon: <AlertTriangle size={18} />, tone: 'text-red-400' },
  }[state.errorType] || { title: 'Donation Transmission Failed', icon: <AlertTriangle size={18} />, tone: 'text-red-400' };

  return (
    <div className={`rounded-2xl border border-red-500/20 bg-red-500/5 p-5 ${state.errorType === ErrorType.INSUFFICIENT_BALANCE ? 'error-shake' : ''}`}>
      <div className={`flex items-center gap-2 font-['Orbitron'] text-xs font-bold tracking-wider ${errorCopy.tone}`}>
        {errorCopy.icon}
        <span>{errorCopy.title}</span>
      </div>
      <div className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">{state.message}</div>
      {onRetry ? (
        <button
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,229,255,0.3)] bg-white/5 px-4 py-1.5 text-xs tracking-wider text-[var(--accent-cyan)] hover:bg-white/10"
          onClick={onRetry}
        >
          <RefreshCw size={12} /> Try Again
        </button>
      ) : null}
    </div>
  );
}