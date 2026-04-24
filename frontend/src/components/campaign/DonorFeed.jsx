import GlassCard from '@/components/ui/GlassCard';

function relativeTime(timestamp) {
  const seconds = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hours ago`;
}

export default function DonorFeed({ events = [] }) {
  return (
    <GlassCard className="h-full">
      <div className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">Live donor feed</div>
      <div className="space-y-3">
        {events.slice(0, 10).map((event) => (
          <div key={event.txHash} className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm">
            <div className="font-['IBM_Plex_Mono'] text-[var(--text-primary)]">{event.donor.slice(0, 6)}...{event.donor.slice(-4)}</div>
            <div className="mt-1 text-[var(--accent-cyan)]">{Number(event.amount).toFixed(2)} XLM</div>
            <div className="mt-1 text-xs text-[var(--text-secondary)]">{relativeTime(event.timestamp)}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}