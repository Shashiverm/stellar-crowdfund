import { createPortal } from 'react-dom';
import { ShieldCheck, Wallet, X } from 'lucide-react';

export default function WalletModal({ open, wallets = [], onSelect, onClose, connecting }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-[rgba(0,229,255,0.3)] bg-[rgba(7,13,20,0.95)] p-6 shadow-[0_0_60px_rgba(0,229,255,0.2)] backdrop-blur-2xl transition-all duration-300">
        {/* Glow backdrop accent */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[var(--accent-cyan)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-[var(--accent-purple)]/20 blur-3xl" />

        {/* Header */}
        <div className="relative mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(0,229,255,0.3)] bg-[rgba(0,229,255,0.08)] text-[var(--accent-cyan)] shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <Wallet size={20} />
            </span>
            <div>
              <h3 className="font-['Orbitron'] text-lg font-bold tracking-[0.16em] text-[var(--text-primary)]">Connect Wallet</h3>
              <p className="text-xs text-[var(--text-secondary)]">Select a Stellar module to proceed</p>
            </div>
          </div>
          <button 
            aria-label="Close wallet modal" 
            onClick={onClose}
            className="rounded-full p-2 text-[var(--text-secondary)] transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Wallet Options */}
        <div className="relative grid gap-3">
          {wallets.map((w) => (
            <button
              key={w.id}
              disabled={connecting}
              onClick={() => onSelect(w.id)}
              className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all duration-200 hover:border-[var(--accent-cyan)] hover:bg-[rgba(0,229,255,0.08)] hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] disabled:opacity-50"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 font-['Orbitron'] text-xs font-bold text-[var(--accent-cyan)] group-hover:border-[var(--accent-cyan)]">
                  {w.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-['Orbitron'] text-sm font-semibold tracking-wider text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)]">
                    {w.name}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                    {w.id} wallet
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest text-[var(--accent-cyan)] opacity-0 transition-opacity group-hover:opacity-100">
                  Select
                </span>
                <span className="h-2 w-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan)] opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </button>
          ))}
        </div>

        {/* Security Footer Note */}
        <div className="relative mt-5 flex items-center justify-center gap-2 border-t border-white/10 pt-4 text-center text-[11px] text-[var(--text-secondary)]">
          <ShieldCheck size={14} className="text-[var(--accent-aurora)]" />
          <span>Encrypted Stellar Testnet Connection</span>
        </div>
      </div>
    </div>,
    document.body
  );
}