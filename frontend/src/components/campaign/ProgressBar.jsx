import { motion } from 'framer-motion';

export default function ProgressBar({ value = 0 }) {
  const percent = Math.max(0, Math.min(100, value));
  return (
    <div className="relative h-4 overflow-hidden rounded-full border border-[rgba(0,229,255,0.18)] bg-white/5">
      <motion.div
        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[rgba(0,229,255,0.6)] via-[rgba(57,255,20,0.7)] to-[rgba(0,229,255,0.9)] ${percent > 80 ? 'animate-pulse' : ''}`}
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ boxShadow: '0 0 22px rgba(0, 229, 255, 0.35)' }}
      />
      <motion.div className="absolute right-2 top-[-1.65rem] text-xs uppercase tracking-[0.28em] text-[var(--accent-cyan)]" animate={{ x: `${Math.max(0, percent - 8)}%` }}>
        {percent.toFixed(0)}%
      </motion.div>
    </div>
  );
}