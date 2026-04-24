export default function GlassCard({ className = '', children, ...props }) {
  return (
    <div className={`glass-card rounded-3xl p-5 sm:p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}