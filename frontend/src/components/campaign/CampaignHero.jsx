import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GlowButton from '@/components/ui/GlowButton';
import ProgressBar from './ProgressBar';
import { getActiveContractId, isContractActive } from '@/lib/constants';

export default function CampaignHero({ campaign }) {
  const navigate = useNavigate();
  const activeId = getActiveContractId();
  const isActive = isContractActive(activeId);

  const percent = campaign?.goal ? Math.min(100, (campaign.raised / campaign.goal) * 100) : 0;
  const ownerAddress = campaign?.owner || '';

  return (
    <GlassCard className="relative overflow-hidden p-6 sm:p-8">
      {/* Decorative ambient glow circle */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[rgba(0,229,255,0.12)] blur-3xl" />

      <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}>
        <motion.div className="flex flex-wrap items-center gap-2 mb-3" variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,229,255,0.3)] bg-[rgba(0,229,255,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-cyan)] shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Zap size={12} className="animate-pulse" /> Soroban Smart Contract
          </span>

          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${isActive ? 'border-[rgba(57,255,20,0.3)] bg-[rgba(57,255,20,0.08)] text-[var(--accent-aurora)]' : 'border-amber-400/30 bg-amber-400/10 text-amber-300'}`}>
            <ShieldCheck size={12} /> {isActive ? 'Verified On-Chain' : 'Demo Simulation Mode'}
          </span>
        </motion.div>

        <motion.h1 className="font-['Orbitron'] text-3xl font-bold tracking-[0.18em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          {campaign?.title || 'StellarFund Mission'}
        </motion.h1>

        <motion.p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          Fund decentralized autonomous missions directly via Soroban Smart Contracts on Stellar Testnet. Real-time telemetry, transparent multi-wallet authentication, and on-chain verification.
        </motion.p>

        {ownerAddress ? (
          <motion.div className="mt-3 flex items-center gap-2 text-xs font-['IBM_Plex_Mono'] text-[var(--text-secondary)]" variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
            <span>Contract Authority:</span>
            <span className="text-[var(--accent-cyan)]">{ownerAddress.slice(0, 8)}...{ownerAddress.slice(-6)}</span>
          </motion.div>
        ) : null}

        <motion.div className="mt-8" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            <span>Funding Target Progress</span>
            <span className="text-[var(--accent-cyan)] font-['IBM_Plex_Mono']">{campaign?.raised?.toLocaleString()} / {campaign?.goal?.toLocaleString()} XLM</span>
          </div>
          <ProgressBar value={percent} />
        </motion.div>

        <motion.div className="mt-8 flex flex-wrap items-center gap-4" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          <GlowButton onClick={() => navigate('/donate')}>Initialize Donation</GlowButton>
          
          {isActive ? (
            <a
              href={`https://stellar.expert/explorer/testnet/contract/${activeId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,229,255,0.2)] bg-black/40 px-5 py-3 font-['Orbitron'] text-xs uppercase tracking-[0.18em] text-[var(--text-primary)] transition hover:border-[var(--accent-cyan)] hover:bg-[rgba(0,229,255,0.08)]"
            >
              <span>Explore Ledger</span> <ExternalLink size={14} />
            </a>
          ) : null}
        </motion.div>
      </motion.div>
    </GlassCard>
  );
}