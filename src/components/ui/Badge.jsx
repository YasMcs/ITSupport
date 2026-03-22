import { TICKET_STATUS } from "../../constants/ticketStatus";

const statusStyles = {
  [TICKET_STATUS.ABIERTO]: {
    container: "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]",
  },
  [TICKET_STATUS.EN_PROCESO]: {
    container: "border border-sky-400/20 bg-sky-500/10 text-sky-300",
    dot: "bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]",
  },
  [TICKET_STATUS.CERRADO]: {
    container: "border border-slate-400/15 bg-slate-500/10 text-slate-300",
    dot: "bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.4)]",
  },
  [TICKET_STATUS.ANULADO]: {
    container: "border border-rose-400/20 bg-rose-500/10 text-rose-300",
    dot: "bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.45)]",
  },
};

const statusLabels = {
  [TICKET_STATUS.ABIERTO]: "Abierto",
  [TICKET_STATUS.EN_PROCESO]: "En proceso",
  [TICKET_STATUS.CERRADO]: "Cerrado",
  [TICKET_STATUS.ANULADO]: "Anulado",
};

const sucursalStatusStyles = {
  Activa: {
    container: "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]",
  },
  Desactivada: {
    container: "border border-slate-400/15 bg-slate-500/10 text-slate-300",
    dot: "bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.4)]",
  },
};

const areaStatusStyles = {
  Activa: {
    container: "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]",
  },
  Inactiva: {
    container: "border border-slate-400/15 bg-slate-500/10 text-slate-300",
    dot: "bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.4)]",
  },
};

const priorityStyles = {
  alta: {
    container: "border border-red-400/20 bg-red-500/10 text-red-300",
    dot: "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.55)]",
  },
  media: {
    container: "border border-amber-400/20 bg-amber-500/10 text-amber-300",
    dot: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.45)]",
  },
  baja: {
    container: "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]",
  },
};

const accountStatusStyles = {
  activo: {
    container: "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]",
  },
  suspendido: {
    container: "border border-slate-400/15 bg-slate-500/10 text-slate-300",
    dot: "bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.4)]",
  },
};

const priorityLabels = { alta: "Alta", media: "Media", baja: "Baja" };
const accountStatusLabels = { activo: "Activo", suspendido: "Suspendido" };

function Pill({ label, style }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${style.container}`}>
      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
}

export function Badge({ status, priority, sucursalStatus, areaStatus, accountStatus }) {
  if (priority) {
    return <Pill label={priorityLabels[priority] || priority} style={priorityStyles[priority] || priorityStyles.baja} />;
  }

  if (areaStatus) {
    return <Pill label={areaStatus} style={areaStatusStyles[areaStatus] || areaStatusStyles.Inactiva} />;
  }

  if (sucursalStatus) {
    return <Pill label={sucursalStatus} style={sucursalStatusStyles[sucursalStatus] || sucursalStatusStyles.Desactivada} />;
  }

  if (accountStatus) {
    return <Pill label={accountStatusLabels[accountStatus] || accountStatus} style={accountStatusStyles[accountStatus] || accountStatusStyles.suspendido} />;
  }

  return <Pill label={statusLabels[status] || status} style={statusStyles[status] || statusStyles[TICKET_STATUS.CERRADO]} />;
}
