import { useState } from 'react';
import { Check, Copy, ExternalLink, Terminal, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '@/components/ui/GlassCard';
import { getActiveContractId, isContractActive, HORIZON, NETWORK_PASSPHRASE, SOROBAN_RPC } from '@/lib/constants';

const techStack = ['React 19', 'Vite 6', 'Tailwind 4', 'Framer Motion 12', 'Soroban SDK 21', 'Stellar SDK 13', 'React Query 5', 'StellarWalletsKit'];
const errors = [
  ['WALLET_NOT_FOUND', 'Selected wallet extension is missing or disabled.'],
  ['USER_REJECTED', 'User cancelled the wallet prompt or signature request.'],
  ['INSUFFICIENT_BALANCE', 'Account balance is lower than the requested donation + network fee.'],
];

const deploySteps = [
  {
    step: '1. Build Soroban Smart Contract Wasm',
    cmd: 'cd contract\nstellar contract build',
    desc: 'Compiles contract/src/lib.rs into target/wasm32-unknown-unknown/release/stellar_crowdfund.wasm',
  },
  {
    step: '2. Generate & Fund Testnet Account',
    cmd: 'stellar keys generate alice --network testnet',
    desc: 'Creates a testnet keypair and automatically funds it with 10,000 test XLM via Friendbot.',
  },
  {
    step: '3. Deploy Contract to Stellar Testnet',
    cmd: 'stellar contract deploy \\\n  --wasm target/wasm32-unknown-unknown/release/stellar_crowdfund.wasm \\\n  --source alice \\\n  --network testnet',
    desc: 'Deploys the Wasm binary to Testnet. Output prints your Contract ID starting with C... (e.g. CDLZFC...)',
  },
  {
    step: '4. Initialize Contract State',
    cmd: 'stellar contract invoke \\\n  --network testnet \\\n  --id <YOUR_CONTRACT_ID> \\\n  --source alice \\\n  -- init \\\n  --owner <ALICE_PUBLIC_KEY> \\\n  --title "Deep Space Habitat Relay" \\\n  --goal 1200000000',
    desc: 'Sets campaign title, funding goal (in Stroops), and assigns contract ownership.',
  },
];

export default function About() {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const activeId = getActiveContractId();
  const isActive = isContractActive(activeId);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('CLI command copied!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <GlassCard className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
              <h1 className="font-['Orbitron'] text-3xl font-bold tracking-[0.18em] text-[var(--text-primary)]">Mission Control & Documentation</h1>
            </div>
            <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-2xl">
              StellarFund operates on Stellar Testnet using Soroban smart contracts. Learn how to deploy your own contract and link your <code className="text-[var(--accent-cyan)] font-['IBM_Plex_Mono']">VITE_CONTRACT_ID</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 p-3 font-['IBM_Plex_Mono'] text-xs">
            <span className="text-[var(--text-secondary)]">Status:</span>
            <span className={isActive ? 'text-[var(--accent-aurora)] font-bold' : 'text-amber-400 font-bold'}>
              {isActive ? 'LIVE CONTRACT ACTIVE' : 'DEMO MODE'}
            </span>
          </div>
        </div>

        {/* Contract ID Guide Section */}
        <div className="mt-6">
          <div className="flex items-center gap-2 font-['Orbitron'] text-lg font-bold tracking-[0.15em] text-[var(--accent-cyan)]">
            <Terminal size={20} /> How to obtain VITE_CONTRACT_ID
          </div>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Run the following Soroban CLI commands to build, deploy, and initialize your contract on Testnet:
          </p>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {deploySteps.map(({ step, cmd, desc }, idx) => (
              <div key={step} className="rounded-2xl border border-[rgba(0,229,255,0.15)] bg-black/40 p-4 space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="font-['Orbitron'] text-xs font-bold text-[var(--accent-cyan)]">{step}</span>
                  <button
                    onClick={() => copyToClipboard(cmd, idx)}
                    className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] hover:bg-white/10"
                    title="Copy command"
                  >
                    {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">{desc}</p>
                <pre className="overflow-x-auto rounded-xl bg-black/80 p-3 font-['IBM_Plex_Mono'] text-xs text-[var(--accent-aurora)] leading-relaxed">
                  {cmd}
                </pre>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-[rgba(0,229,255,0.2)] bg-[rgba(0,229,255,0.05)] p-4 text-xs leading-relaxed text-[var(--text-secondary)]">
            <span className="font-bold text-[var(--accent-cyan)]">Configuration Note: </span>
            Once deployed, paste your Contract ID into <code className="text-[var(--text-primary)] font-['IBM_Plex_Mono']">frontend/.env</code> as <code className="text-[var(--accent-cyan)] font-['IBM_Plex_Mono']">VITE_CONTRACT_ID=C...</code> or use the <span className="text-[var(--text-primary)] font-semibold">Contract Telemetry button</span> in the top header to set it directly in the UI!
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Network telemetry */}
        <GlassCard className="p-6">
          <h2 className="font-['Orbitron'] text-lg font-bold tracking-[0.16em] text-[var(--text-primary)] mb-4">Contract Parameters</h2>
          <div className="space-y-3 font-['IBM_Plex_Mono'] text-xs text-[var(--text-secondary)]">
            <div><span className="text-white/40">Network:</span> <span className="text-[var(--accent-cyan)]">Stellar Testnet</span></div>
            <div><span className="text-white/40">Soroban RPC:</span> <span className="text-[var(--text-primary)] break-all">{SOROBAN_RPC}</span></div>
            <div><span className="text-white/40">Horizon REST:</span> <span className="text-[var(--text-primary)] break-all">{HORIZON}</span></div>
            <div><span className="text-white/40">Passphrase:</span> <span className="text-[var(--text-primary)] break-all">{NETWORK_PASSPHRASE}</span></div>
          </div>
        </GlassCard>

        {/* Tech stack */}
        <GlassCard className="p-6">
          <h2 className="font-['Orbitron'] text-lg font-bold tracking-[0.16em] text-[var(--text-primary)] mb-4">Web3 Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--accent-cyan)]">
                {item}
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Error handling matrix */}
        <GlassCard className="p-6">
          <h2 className="font-['Orbitron'] text-lg font-bold tracking-[0.16em] text-[var(--text-primary)] mb-4">Error Diagnostics</h2>
          <div className="space-y-3">
            {errors.map(([code, description]) => (
              <div key={code} className="rounded-xl border border-white/5 bg-white/5 p-3">
                <div className="font-['IBM_Plex_Mono'] text-xs font-bold text-[var(--accent-plasma)]">{code}</div>
                <div className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{description}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}