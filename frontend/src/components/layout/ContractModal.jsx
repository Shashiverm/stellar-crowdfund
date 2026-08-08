import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, ExternalLink, RefreshCw, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getActiveContractId, isContractActive } from '@/lib/constants';

export default function ContractModal({ isOpen, onClose }) {
  const activeId = getActiveContractId();
  const [customId, setCustomId] = useState(activeId);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = customId.trim();
    if (trimmed) {
      localStorage.setItem('stellar_custom_contract_id', trimmed);
      toast.success('Contract ID updated! Reloading telemetry...');
    } else {
      localStorage.removeItem('stellar_custom_contract_id');
      toast.success('Reset to environment Contract ID.');
    }
    onClose();
    window.location.reload();
  };

  const handleReset = () => {
    localStorage.removeItem('stellar_custom_contract_id');
    setCustomId((import.meta.env.VITE_CONTRACT_ID || '').trim());
    toast.success('Contract ID reset to default.');
  };

  const handleCopy = () => {
    if (!activeId) return;
    navigator.clipboard.writeText(activeId);
    setCopied(true);
    toast.success('Contract ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[rgba(0,229,255,0.25)] bg-[rgba(7,13,20,0.95)] p-6 shadow-[0_0_50px_rgba(0,229,255,0.15)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
            <h3 className="font-['Orbitron'] text-lg tracking-[0.18em] text-[var(--text-primary)]">Contract Telemetry</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-[var(--text-secondary)] hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-[var(--text-secondary)]">Active Contract ID</label>
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-black/40 p-3 font-['IBM_Plex_Mono'] text-xs break-all">
              <span className={isContractActive(activeId) ? 'text-[var(--accent-cyan)]' : 'text-amber-400 font-sans'}>
                {activeId || 'Demo Mode (No VITE_CONTRACT_ID configured)'}
              </span>
              {activeId ? (
                <button onClick={handleCopy} className="ml-2 shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 text-[var(--accent-cyan)] hover:bg-white/10">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              ) : null}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-[var(--text-secondary)]">Override Contract Address (Testnet)</label>
            <input
              type="text"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              placeholder="CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              className="w-full rounded-2xl border border-[rgba(0,229,255,0.2)] bg-black/40 px-4 py-3 font-['IBM_Plex_Mono'] text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-cyan)]"
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--text-secondary)]">
              Deploy your own Soroban contract using <code className="text-[var(--accent-cyan)]">stellar contract deploy</code> and paste the Contract ID above.
            </p>
          </div>

          {isContractActive(activeId) ? (
            <a
              href={`https://stellar.expert/explorer/testnet/contract/${activeId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs text-[var(--accent-cyan)] hover:underline"
            >
              View Contract on Stellar Expert <ExternalLink size={12} />
            </a>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-wider text-[var(--text-secondary)] hover:text-white"
          >
            <RefreshCw size={12} /> Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="rounded-full bg-gradient-to-r from-[rgba(0,229,255,0.8)] to-[rgba(123,97,255,0.8)] px-5 py-2 font-['Orbitron'] text-xs font-semibold tracking-widest text-black shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:opacity-90"
          >
            SAVE CONTRACT
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
