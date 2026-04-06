export function LoadingState({
  title = "Cargando...",
  className = "",
}) {
  return (
    <div className={`glass-card rounded-[2rem] p-12 flex flex-col items-center gap-6 transition-all duration-500 ${className}`}>
      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.08]">
        <div className="absolute inset-0 rounded-2xl border-2 border-white/[0.15] animate-ping" />
        <div className="h-10 w-10 rounded-full border-3 border-purple-electric/20 border-t-purple-electric animate-spin" />
      </div>
      <h2 className="text-2xl font-bold text-text-primary text-center">{title}</h2>
    </div>
  );
}
