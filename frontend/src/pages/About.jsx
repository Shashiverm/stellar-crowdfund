import { ExternalLink } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { CONTRACT_ID, HORIZON, SOROBAN_RPC, NETWORK_PASSPHRASE } from '@/lib/constants';

const techStack = ['React 19', 'Vite 6', 'Tailwind 4', 'Framer Motion 12', 'Soroban SDK 21', 'Stellar SDK 13', 'React Query 5', 'StellarWalletsKit'];
const errors = [
  ['WALLET_NOT_FOUND', 'Selected wallet extension is missing'],
  ['USER_REJECTED', 'User cancelled the popup'],
  ['INSUFFICIENT_BALANCE', 'Not enough XLM available'],
];

export default function About() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassCard>
        <h1 className="font-['Orbitron'] text-3xl tracking-[0.18em]">Project</h1>
        <p className="mt-4 text-[var(--text-secondary)]">StellarFund is a Yellow Belt crowdfunding dApp that uses a Soroban contract for campaign state, donations, and live event feeds on Stellar Testnet.</p>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 font-['IBM_Plex_Mono'] text-sm break-all">{CONTRACT_ID}</div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,229,255,0.2)] px-4 py-2">View on Stellar Expert <ExternalLink size={14} /></a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,229,255,0.2)] px-4 py-2">View Source on GitHub <ExternalLink size={14} /></a>
        </div>
      </GlassCard>
      <div className="space-y-6">
        <GlassCard>
          <h2 className="font-['Orbitron'] text-2xl tracking-[0.16em]">Contract details</h2>
          <div className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
            <div>Network: Testnet</div>
            <div>RPC: {SOROBAN_RPC}</div>
            <div>Horizon: {HORIZON}</div>
            <div>Passphrase: {NETWORK_PASSPHRASE}</div>
          </div>
        </GlassCard>
        <GlassCard>
          <h2 className="font-['Orbitron'] text-2xl tracking-[0.16em]">Tech stack</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {techStack.map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.24em] text-[var(--text-secondary)]">{item}</span>)}
          </div>
        </GlassCard>
        <GlassCard>
          <h2 className="font-['Orbitron'] text-2xl tracking-[0.16em]">Error handling</h2>
          <div className="mt-4 space-y-3 text-sm">
            {errors.map(([code, description]) => <div key={code} className="rounded-2xl border border-white/5 bg-white/5 p-3"><div className="font-semibold text-[var(--accent-cyan)]">{code}</div><div className="text-[var(--text-secondary)]">{description}</div></div>)}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}