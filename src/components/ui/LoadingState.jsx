export function LoadingState({
  title = "Cargando contenido",
  description = "Espera un momento mientras preparamos esta vista.",
  variant = "panel",
  className = "",
}) {
  if (variant === "compact") {
    return (
      <div className={`glass-card rounded-2xl p-8 ${className}`}>
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05]">
            <div className="absolute inset-0 rounded-2xl border border-white/[0.06]" />
            <div className="h-5 w-5 rounded-full border-2 border-purple-electric/25 border-t-purple-electric animate-spin" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="loading-shimmer h-3.5 w-40 rounded-full" />
            <div className="loading-shimmer mt-3 h-2.5 w-64 max-w-full rounded-full opacity-80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card overflow-hidden rounded-[2rem] p-6 md:p-8 ${className}`}>
      <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div>
          <span className="inline-flex rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
            Cargando vista
          </span>
          <div className="mt-5 space-y-3">
            <div className="loading-shimmer h-6 w-56 max-w-full rounded-full" />
            <div className="loading-shimmer h-3 w-72 max-w-full rounded-full opacity-90" />
            <div className="loading-shimmer h-3 w-64 max-w-full rounded-full opacity-75" />
          </div>

          <div className="mt-8 space-y-3">
            <div className="loading-shimmer h-14 rounded-2xl" />
            <div className="loading-shimmer h-14 rounded-2xl opacity-90" />
            <div className="loading-shimmer h-14 rounded-2xl opacity-75" />
          </div>

          <div className="sr-only">
            <p>{title}</p>
            <p>{description}</p>
          </div>
        </div>

        <div className="relative hidden min-h-[240px] rounded-[1.8rem] bg-white/[0.035] md:block">
          <div className="absolute inset-5 rounded-[1.5rem] border border-white/[0.06] bg-[#120f1d]/85" />
          <div className="absolute left-1/2 top-7 h-2.5 w-24 -translate-x-1/2 rounded-full bg-white/[0.08]" />
          <div className="absolute left-8 right-8 top-16 space-y-4">
            <div className="loading-shimmer h-24 rounded-[1.4rem]" />
            <div className="grid grid-cols-2 gap-4">
              <div className="loading-shimmer h-16 rounded-[1.2rem] opacity-90" />
              <div className="loading-shimmer h-16 rounded-[1.2rem] opacity-75" />
            </div>
            <div className="loading-shimmer h-20 rounded-[1.3rem] opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
}
