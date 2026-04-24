const presets = [10, 50, 100];

export default function AmountPresets({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <button
          key={preset}
          type="button"
          className={`rounded-full border px-4 py-2 text-sm transition ${Number(value) === preset ? 'border-[var(--accent-cyan)] bg-[rgba(0,229,255,0.12)] text-[var(--accent-cyan)]' : 'border-white/10 bg-white/5 text-[var(--text-primary)] hover:border-[rgba(0,229,255,0.18)]'}`}
          onClick={() => onChange(preset)}
        >
          {preset} XLM
        </button>
      ))}
    </div>
  );
}