import { useState } from 'react';
import { Cpu, Rocket, ShieldAlert, Sparkles } from 'lucide-react';
import AmountPresets from './AmountPresets';
import GlowButton from '@/components/ui/GlowButton';
import { getActiveContractId, isContractActive } from '@/lib/constants';

export default function DonateForm({ onSubmit, loading = false }) {
  const [amount, setAmount] = useState('10');
  const activeId = getActiveContractId();
  const isActive = isContractActive(activeId);

  const numAmount = Number(amount) || 0;

  return (
    <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); onSubmit(numAmount); }}>
      <AmountPresets value={amount} onChange={(next) => setAmount(String(next))} />

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-[var(--text-secondary)]">Donation Amount</span>
        <div className="flex items-center gap-3 rounded-3xl border border-[rgba(0,229,255,0.25)] bg-black/40 px-5 py-4 transition focus-within:border-[var(--accent-cyan)] focus-within:shadow-[0_0_20px_rgba(0,229,255,0.15)]">
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            className="w-full bg-transparent font-['IBM_Plex_Mono'] text-3xl font-bold text-[var(--text-primary)] outline-none"
            placeholder="10"
            min="1"
          />
          <span className="font-['Orbitron'] text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-cyan)]">XLM</span>
        </div>
      </label>

      {/* Web3 Simulation Preview Box */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs font-['IBM_Plex_Mono'] space-y-2.5">
        <div className="flex items-center justify-between text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5"><Cpu size={13} /> Target Smart Contract</span>
          <span className="text-[var(--text-primary)] font-medium">
            {isActive ? `${activeId.slice(0, 6)}...${activeId.slice(-6)}` : 'Demo Contract'}
          </span>
        </div>

        <div className="flex items-center justify-between text-[var(--text-secondary)]">
          <span>Stellar Base Fee</span>
          <span className="text-[var(--accent-aurora)] font-medium">100 Stroops (~0.00001 XLM)</span>
        </div>

        <div className="flex items-center justify-between text-[var(--text-secondary)] border-t border-white/5 pt-2">
          <span>Est. Transaction Execution</span>
          <span className="text-[var(--accent-cyan)] font-medium">&lt; 3.2s (Testnet RPC)</span>
        </div>
      </div>

      <GlowButton loading={loading} type="submit" className="w-full py-4 text-sm font-['Orbitron'] tracking-[0.2em]">
        <span className="flex items-center justify-center gap-2">
          <Rocket size={16} /> LAUNCH DONATION ({numAmount} XLM)
        </span>
      </GlowButton>
    </form>
  );
}