export function LoadingState({
  title = "Cargando contenido",
  description = "Espera un momento mientras preparamos esta vista.",
  className = "",
}) {
  const titleLower = title.toLowerCase();
  
  const isTickets = titleLower.includes('ticket');
  const isListPage = titleLower.includes('usuario') || titleLower.includes('area') || titleLower.includes('sucursal');
  const isDashboard = titleLower.includes('dashboard') || titleLower.includes('estadística');
  const isDetail = titleLower.includes('detalle');

  const renderShimmers = () => {
    if (isDashboard) {
      return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="loading-shimmer h-32 rounded-2xl" />
          ))}
        </div>
      );
    }
    
    if (isTickets) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading-shimmer h-40 rounded-2xl" />
            ))}
          </div>
          <div className="loading-shimmer h-72 rounded-3xl mt-8" />
        </div>
      );
    }
    
    if (isListPage) {
      return (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="loading-shimmer h-14 rounded-xl" />
          ))}
        </div>
      );
    }
    
    if (isDetail) {
      return (
        <div className="space-y-6">
          <div className="loading-shimmer h-20 rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            <div className="loading-shimmer h-32 rounded-2xl" />
            <div className="loading-shimmer h-24 rounded-xl" />
          </div>
        </div>
      );
    }
    
    // Default spinner
    return (
      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.05]">
        <div className="absolute inset-0 rounded-2xl border border-white/[0.1]" />
        <div className="h-12 w-12 rounded-full border-3 border-purple-electric/20 border-t-purple-electric animate-spin" />
      </div>
    );
  };

  return (
    <div className={`glass-card overflow-hidden rounded-[2rem] p-8 md:p-10 ${className}`}>
      <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div>
          <span className="inline-flex rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
            Cargando {isTickets ? 'tickets' : isListPage ? 'lista' : isDashboard ? 'métricas' : 'vista'}
          </span>
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-text-primary mb-3">{title}</h2>
            <p className="text-text-secondary max-w-md mb-8">{description}</p>
            {renderShimmers()}
          </div>
        </div>

        <div className="relative hidden min-h-[300px] rounded-[1.8rem] bg-white/[0.04] md:block">
          <div className="absolute inset-4 rounded-[1.4rem] border border-white/[0.08] bg-[#120f1d]/90" />
          <div className="absolute inset-0 p-8 space-y-4">
            <div className="loading-shimmer h-6 w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-3 h-20 w-full" />
            <div className="loading-shimmer h-12 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
