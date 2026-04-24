import { X } from 'lucide-react';

export default function WalletModal({ open, wallets = [], onSelect, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
      <div className="glass-card w-full max-w-md rounded-[28px] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="font-['Orbitron'] text-lg tracking-[0.18em]">Connect wallet</div>
            <div className="text-sm text-[var(--text-secondary)]">Choose a Stellar wallet module</div>
          </div>
          <button aria-label="Close wallet modal" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="grid gap-3">
          {wallets.map((wallet) => (
            <button key={wallet.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-[var(--accent-cyan)]" onClick={() => onSelect(wallet.id)}>
              <div className="font-semibold text-[var(--text-primary)]">{wallet.name}</div>
              <div className="text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">{wallet.id}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}