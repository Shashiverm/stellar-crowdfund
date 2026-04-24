import { useState } from 'react';
import AmountPresets from './AmountPresets';
import GlowButton from '@/components/ui/GlowButton';

export default function DonateForm({ onSubmit, loading = false }) {
  const [amount, setAmount] = useState('10');

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit(Number(amount)); }}>
      <AmountPresets value={amount} onChange={(next) => setAmount(String(next))} />
      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">Donation amount</span>
        <div className="flex items-center gap-3 rounded-3xl border border-[rgba(0,229,255,0.18)] bg-black/20 px-4 py-4">
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            className="w-full bg-transparent font-['IBM_Plex_Mono'] text-3xl outline-none"
            placeholder="10"
          />
          <span className="text-sm uppercase tracking-[0.28em] text-[var(--text-secondary)]">XLM</span>
        </div>
      </label>
      <GlowButton loading={loading} type="submit" className="w-full">Launch Donation</GlowButton>
    </form>
  );
}