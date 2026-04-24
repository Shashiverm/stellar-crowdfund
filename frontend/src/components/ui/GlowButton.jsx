import Spinner from './Spinner';

export default function GlowButton({ loading, children, className = '', ...props }) {
  return (
    <button className={`glow-button inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-[var(--text-primary)] transition duration-200 hover:scale-[1.01] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <Spinner size="sm" /> : children}
    </button>
  );
}