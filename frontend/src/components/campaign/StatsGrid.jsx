import GlassCard from '@/components/ui/GlassCard';
import CountUp from '@/components/ui/CountUp';

export default function StatsGrid({ campaign }) {
  const items = [
    ['Total Raised', campaign?.raised || 0, ' XLM'],
    ['Campaign Goal', campaign?.goal || 0, ' XLM'],
    ['Total Donors', campaign?.donor_count || 0, ''],
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map(([label, value, suffix]) => (
        <GlassCard key={label}>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">{label}</div>
          <div className="mt-3 font-['Orbitron'] text-3xl text-[var(--text-primary)]">
            <CountUp value={value} suffix={suffix} />
          </div>
        </GlassCard>
      ))}
    </div>
  );
}