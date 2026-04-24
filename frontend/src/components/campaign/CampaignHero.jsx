import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import GlowButton from '@/components/ui/GlowButton';
import ProgressBar from './ProgressBar';

export default function CampaignHero({ campaign }) {
  const navigate = useNavigate();
  const percent = campaign?.goal ? Math.min(100, (campaign.raised / campaign.goal) * 100) : 0;

  return (
    <GlassCard className="overflow-hidden">
      <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}>
        <motion.h1 className="font-['Orbitron'] text-4xl font-bold tracking-[0.22em] md:text-6xl" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          {campaign?.title || 'StellarFund Mission'}
        </motion.h1>
        <motion.p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          Fund the next wave of decentralized missions on Stellar Testnet. This campaign is backed by a live Soroban contract, a wallet-powered donation flow, and an animated command-deck interface.
        </motion.p>
        <motion.div className="mt-8" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          <ProgressBar value={percent} />
        </motion.div>
        <motion.div className="mt-8 flex flex-wrap gap-3" variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          <GlowButton onClick={() => navigate('/donate')}>Fund the mission</GlowButton>
        </motion.div>
      </motion.div>
    </GlassCard>
  );
}