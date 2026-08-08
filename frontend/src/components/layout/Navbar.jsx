import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Cpu, ExternalLink, Menu, Rocket, ShieldCheck } from 'lucide-react';
import WalletButton from '@/components/wallet/WalletButton';
import ContractModal from './ContractModal';
import { checkRpcPing } from '@/lib/contract';
import { getActiveContractId, isContractActive } from '@/lib/constants';

const links = [
  ['Home', '/'],
  ['Donate', '/donate'],
  ['Activity', '/activity'],
  ['About', '/about'],
];

export default function Navbar({ wallet }) {
  const [open, setOpen] = useState(false);
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [rpcOnline, setRpcOnline] = useState(true);

  const activeId = getActiveContractId();
  const isActive = isContractActive(activeId);

  useEffect(() => {
    let mounted = true;
    checkRpcPing().then((ping) => {
      if (mounted) setRpcOnline(ping);
    });
    const interval = setInterval(() => {
      checkRpcPing().then((ping) => {
        if (mounted) setRpcOnline(ping);
      });
    }, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-[rgba(0,229,255,0.15)] bg-[rgba(2,4,8,0.85)] backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(0,229,255,0.3)] bg-[rgba(0,229,255,0.08)] text-[var(--accent-cyan)] shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-transform group-hover:scale-105">
                <Rocket size={18} />
              </span>
              <div>
                <div className="font-['Orbitron'] text-lg font-bold tracking-[0.22em] text-[var(--text-primary)]">StellarFund</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">Web3 Command Deck</div>
              </div>
            </Link>

            {/* Network pill */}
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs sm:flex">
              <span className={`h-2 w-2 rounded-full ${rpcOnline ? 'bg-[var(--accent-aurora)] shadow-[0_0_8px_var(--accent-aurora)] animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-['IBM_Plex_Mono'] text-[11px] text-[var(--text-secondary)]">Stellar Testnet</span>
            </div>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all ${
                    isActive
                      ? 'bg-[rgba(0,229,255,0.1)] text-[var(--accent-cyan)] shadow-[0_0_15px_rgba(0,229,255,0.15)] border border-[rgba(0,229,255,0.25)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Contract ID Trigger Button */}
            <button
              onClick={() => setContractModalOpen(true)}
              className="hidden items-center gap-2 rounded-full border border-[rgba(0,229,255,0.2)] bg-black/40 px-3.5 py-1.5 text-xs transition hover:border-[var(--accent-cyan)] hover:bg-[rgba(0,229,255,0.05)] lg:flex"
              title="Inspect or set VITE_CONTRACT_ID"
            >
              <Cpu size={14} className={isActive ? 'text-[var(--accent-cyan)]' : 'text-amber-400'} />
              <span className="font-['IBM_Plex_Mono'] text-[11px]">
                {isActive ? `${activeId.slice(0, 5)}...${activeId.slice(-4)}` : 'Demo Contract'}
              </span>
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider ${isActive ? 'bg-[var(--accent-aurora)]/20 text-[var(--accent-aurora)]' : 'bg-amber-400/20 text-amber-300'}`}>
                {isActive ? 'Live' : 'Demo'}
              </span>
            </button>

            <WalletButton wallet={wallet} />

            <button
              aria-label="Open navigation menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(0,229,255,0.2)] bg-[rgba(7,13,20,0.8)] text-[var(--text-primary)] md:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <ContractModal isOpen={contractModalOpen} onClose={() => setContractModalOpen(false)} />

      <div className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setOpen(false)} />
      <aside className={`fixed left-0 top-0 z-[60] h-full w-[82vw] max-w-sm border-r border-[rgba(0,229,255,0.16)] bg-[rgba(2,4,8,0.98)] backdrop-blur-2xl transition-transform duration-300 md:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div className="font-['Orbitron'] text-xs tracking-[0.3em] text-[var(--accent-cyan)]">NAVIGATION</div>
          <button aria-label="Close navigation menu" onClick={() => setOpen(false)}>
            <Menu size={18} />
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `rounded-2xl px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.22em] ${isActive ? 'bg-[rgba(0,229,255,0.1)] text-[var(--accent-cyan)] border border-[rgba(0,229,255,0.2)]' : 'text-[var(--text-primary)] hover:bg-white/5'}`}
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => { setOpen(false); setContractModalOpen(true); }}
            className="mt-4 flex items-center justify-between rounded-2xl border border-[rgba(0,229,255,0.2)] bg-black/40 px-4 py-3 text-xs tracking-widest text-[var(--accent-cyan)]"
          >
            <span>Contract Settings</span>
            <Cpu size={14} />
          </button>
        </nav>
      </aside>
    </>
  );
}