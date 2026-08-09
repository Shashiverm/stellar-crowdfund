import { useState } from 'react';
import { LogOut, Wallet } from 'lucide-react';
import WalletBadge from './WalletBadge';
import WalletModal from './WalletModal';

export default function WalletButton({ wallet }) {
  const [open, setOpen] = useState(false);

  if (!wallet.publicKey) {
    return (
      <>
        <button className="glow-button hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold md:inline-flex" onClick={() => setOpen(true)}>
          <Wallet size={16} />
          Connect Wallet
        </button>
        <button aria-label="Connect wallet" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(0,229,255,0.2)] bg-[rgba(7,13,20,0.8)] text-[var(--accent-cyan)] md:hidden" onClick={() => setOpen(true)}>
          <Wallet size={18} />
        </button>
        <WalletModal
          open={open}
          wallets={wallet.wallets}
          connecting={wallet.connecting}
          error={wallet.error}
          isFreighterInstalled={wallet.isFreighterInstalled}
          onSelect={async (walletId) => {
            try {
              await wallet.connect(walletId);
              setOpen(false);
            } catch {
              /* keep modal open so user sees error banner */
            }
          }}
          onClose={() => setOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <WalletBadge address={wallet.publicKey} />
      <button aria-label="Disconnect wallet" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,107,53,0.24)] bg-[rgba(255,107,53,0.08)] text-[var(--accent-plasma)]" onClick={wallet.disconnect}>
        <LogOut size={16} />
      </button>
    </div>
  );
}