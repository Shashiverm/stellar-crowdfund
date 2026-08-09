import { Copy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { CONTRACT_ACTIVE, CONTRACT_ID_DISPLAY, HORIZON } from '@/lib/constants';

export default function Footer() {
  const copy = async () => {
    if (!CONTRACT_ACTIVE) {
      toast.error('Add VITE_CONTRACT_ID to frontend/.env first.');
      return;
    }

    await navigator.clipboard.writeText(CONTRACT_ID_DISPLAY);
    toast.success('Contract ID copied to clipboard.');
  };

  return (
    <footer className="border-t border-[rgba(0,229,255,0.08)] bg-[rgba(2,4,8,0.86)] px-4 py-8 text-sm text-[var(--text-secondary)] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <button onClick={copy} className="inline-flex items-center gap-2 self-start rounded-full border border-[rgba(0,229,255,0.18)] px-3 py-2 text-left text-[var(--text-primary)] transition hover:border-[var(--accent-cyan)] disabled:cursor-not-allowed disabled:opacity-60" aria-label="Copy contract ID" disabled={!CONTRACT_ACTIVE}>
            <span className="font-['IBM_Plex_Mono']">{CONTRACT_ID_DISPLAY}</span>
            <Copy size={14} />
          </button>
          <div className="text-xs uppercase tracking-[0.28em] text-[var(--accent-cyan)]">Built on Stellar Testnet</div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.24em]">
          <a href={HORIZON} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-[var(--text-primary)]">Stellar Testnet <ExternalLink size={12} /></a>
          <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-[var(--text-primary)]">Stellar Expert <ExternalLink size={12} /></a>
          <a href="https://github.com/Shashiverm/stellar-crowdfund" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-[var(--text-primary)]">GitHub <ExternalLink size={12} /></a>
        </div>
      </div>
    </footer>
  );
}