export default function ParticleBurst() {
  return (
    <div className="pointer-events-none relative h-16 w-16">
      {Array.from({ length: 8 }).map((_, index) => (
        <span
          key={index}
          className="particle-burst absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-[var(--accent-aurora)] opacity-80"
          style={{ transform: `rotate(${index * 45}deg) translate(0, -1.8rem)`, animationDelay: `${index * 24}ms` }}
        />
      ))}
    </div>
  );
}