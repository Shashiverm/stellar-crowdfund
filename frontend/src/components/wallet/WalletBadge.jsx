import { Circle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WalletBadge({ address }) {
  const short = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'Disconnected';
  const copy = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied.');
    }
  };

  return (
    <button onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-[rgba(57,255,20,0.22)] bg-[rgba(57,255,20,0.08)] px-3 py-2 text-xs text-[var(--text-primary)]">
      <Circle size={10} className="fill-[var(--accent-aurora)] text-[var(--accent-aurora)]" />
      <span className="font-['IBM_Plex_Mono'] tracking-[0.15em]">{short}</span>
      <Copy size={12} />
    </button>
  );
}