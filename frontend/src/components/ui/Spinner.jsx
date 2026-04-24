export default function Spinner({ size = 'md' }) {
  const dimensions = size === 'sm' ? 'h-5 w-5' : 'h-8 w-8';
  return (
    <span className={`relative inline-flex ${dimensions}`} aria-label="Loading" role="status">
      <span className="absolute inset-0 rounded-full border border-[rgba(0,229,255,0.28)] border-t-[var(--accent-cyan)] pulse-ring" />
      <span className="absolute inset-[4px] rounded-full border border-[rgba(57,255,20,0.22)] border-b-[var(--accent-aurora)] pulse-ring" style={{ animationDuration: '0.9s' }} />
    </span>
  );
}