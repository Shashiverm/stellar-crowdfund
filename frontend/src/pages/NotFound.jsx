import { Link } from 'react-router-dom';
import GlassCard from '@/components/ui/GlassCard';

export default function NotFound() {
  return (
    <GlassCard className="mx-auto max-w-xl text-center">
      <div className="font-['Orbitron'] text-4xl tracking-[0.2em]">Lost in the void</div>
      <p className="mt-4 text-[var(--text-secondary)]">The requested route drifted beyond the mission corridor.</p>
      <Link className="mt-6 inline-flex rounded-full border border-[rgba(0,229,255,0.2)] px-4 py-2" to="/">Return to deck</Link>
    </GlassCard>
  );
}