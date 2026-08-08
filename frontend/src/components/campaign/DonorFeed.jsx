import { ExternalLink, Radio } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

function relativeTime(timestamp) {
  const seconds = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export default function DonorFeed({ events = [] }) {
  return (
    <GlassCard className="h-full p-5">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Radio size={14} className="animate-pulse text-[var(--accent-aurora)]" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--text-secondary)]">Live Donor Feed</span>
        </div>
        <span className="rounded-full bg-[rgba(0,229,255,0.1)] px-2.5 py-0.5 font-['IBM_Plex_Mono'] text-[10px] font-bold text-[var(--accent-cyan)]">
          POLLING 5S
        </span>
      </div>

      <div className="space-y-3">
        {events.slice(0, 10).map((event, idx) => (
          <div key={event.txHash || idx} className="group rounded-2xl border border-white/5 bg-white/5 p-3.5 transition-all hover:border-[rgba(0,229,255,0.3)] hover:bg-black/30">
            <div className="flex items-center justify-between">
              <span className="font-['IBM_Plex_Mono'] text-xs font-medium text-[var(--text-primary)]">
                {event.donor.length > 12 ? `${event.donor.slice(0, 6)}...${event.donor.slice(-4)}` : event.donor}
              </span>
              <span className="font-['Orbitron'] text-xs font-bold text-[var(--accent-cyan)]">
                +{Number(event.amount).toFixed(2)} XLM
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
              <span>{relativeTime(event.timestamp)}</span>
              {event.txHash && !event.txHash.startsWith('demo-') ? (
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--text-secondary)] transition hover:text-[var(--accent-cyan)]"
                >
                  <span>Tx Hash</span> <ExternalLink size={10} />
                </a>
              ) : (
                <span className="text-[10px] uppercase tracking-wider text-white/40">Verified</span>
              )}
            </div>
          </div>
        ))}

        {!events.length ? (
          <div className="py-12 text-center text-xs text-[var(--text-secondary)]">
            Awaiting on-chain transmissions...
          </div>
        ) : null}
      </div>
    </GlassCard>
  );
}