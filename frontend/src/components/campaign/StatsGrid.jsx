import { Coins, Target, Users } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import CountUp from '@/components/ui/CountUp';

export default function StatsGrid({ campaign }) {
  const items = [
    { label: 'Total Raised', value: campaign?.raised || 0, suffix: ' XLM', icon: Coins, tone: 'text-[var(--accent-aurora)]' },
    { label: 'Campaign Target', value: campaign?.goal || 0, suffix: ' XLM', icon: Target, tone: 'text-[var(--accent-cyan)]' },
    { label: 'Verified Donors', value: campaign?.donor_count || 0, suffix: '', icon: Users, tone: 'text-[var(--accent-stellar)]' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map(({ label, value, suffix, icon: Icon, tone }) => (
        <GlassCard key={label} className="p-5 border-[rgba(0,229,255,0.15)] transition-all hover:border-[var(--accent-cyan)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--text-secondary)]">{label}</span>
            <div className={`rounded-xl border border-white/10 bg-white/5 p-2 ${tone}`}>
              <Icon size={16} />
            </div>
          </div>
          <div className="mt-3 font-['Orbitron'] text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            <CountUp value={value} suffix={suffix} />
          </div>
        </GlassCard>
      ))}
    </div>
  );
}