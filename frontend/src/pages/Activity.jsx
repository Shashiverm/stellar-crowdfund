import { useMemo, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { useEvents } from '@/hooks/useEvents';

export default function Activity() {
  const { events } = useEvents();
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    const now = Date.now();
    if (filter === 'hour') return events.filter((event) => now - event.timestamp < 3600000);
    if (filter === 'today') return events.filter((event) => now - event.timestamp < 86400000);
    return events;
  }, [events, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-['Orbitron'] text-3xl tracking-[0.18em]">Mission Log</h1>
        <div className="flex gap-2 text-sm">
          {['all', 'hour', 'today'].map((item) => <button key={item} className={`rounded-full border px-4 py-2 ${filter === item ? 'border-[var(--accent-cyan)] text-[var(--accent-cyan)]' : 'border-white/10 text-[var(--text-secondary)]'}`} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
      </div>
      <GlassCard>
        <div className="grid gap-3">
          {filtered.map((event) => (
            <div key={event.txHash} className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-['IBM_Plex_Mono']">{event.donor.slice(0, 6)}...{event.donor.slice(-4)}</div>
                <div className="text-[var(--accent-cyan)]">{Number(event.amount).toFixed(2)} XLM</div>
              </div>
              <div className="mt-2 text-xs text-[var(--text-secondary)]">{new Date(event.timestamp).toLocaleString()}</div>
            </div>
          ))}
          {!filtered.length ? <div className="py-8 text-center text-[var(--text-secondary)]">Awaiting first transmission...</div> : null}
        </div>
      </GlassCard>
    </div>
  );
}