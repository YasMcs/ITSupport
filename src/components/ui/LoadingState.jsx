export function LoadingState({
  title = "Cargando...",
  className = "",
}) {
  return (
    <div className={`glass-card rounded-[2rem] p-10 flex flex-col items-center gap-4 transition-all duration-300 ${className}`}>
      <div className="h-8 w-8 rounded-full border-2 border-purple-electric/30 border-t-purple-electric animate-spin" />
      <h2 className="text-xl font-bold text-text-primary text-center">{title}</h2>
    </div>
  );
}
