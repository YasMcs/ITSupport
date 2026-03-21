import { TICKET_STATUS } from "../../constants/ticketStatus";

const statusStyles = {
  [TICKET_STATUS.ABIERTO]: "bg-accent-blue/20 text-accent-blue border border-accent-blue/30",
  [TICKET_STATUS.EN_PROCESO]: "bg-accent-orange/20 text-accent-orange border border-accent-orange/30",
  [TICKET_STATUS.CERRADO]: "bg-dark-purple-800 text-text-secondary border border-dark-purple-700",
  [TICKET_STATUS.ANULADO]: "bg-accent-pink/20 text-accent-pink border border-accent-pink/30",
};

const statusLabels = {
  [TICKET_STATUS.ABIERTO]: "Abierto",
  [TICKET_STATUS.EN_PROCESO]: "En proceso",
  [TICKET_STATUS.CERRADO]: "Cerrado",
  [TICKET_STATUS.ANULADO]: "Anulado",
};

const sucursalStatusStyles = {
  Activa: "bg-green-500/20 text-green-400 border border-green-500/30",
  Desactivada: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
};

const areaStatusStyles = {
  Activa: "bg-green-500/20 text-green-400 border border-green-500/30",
  Inactiva: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
};

const priorityStyles = {
  alta: "bg-accent-pink/20 text-accent-pink border border-accent-pink/30",
  media: "bg-accent-orange/20 text-accent-orange border border-accent-orange/30",
  baja: "bg-dark-purple-800 text-text-secondary border border-dark-purple-700",
};

const accountStatusStyles = {
  activo: "bg-green-500/20 text-green-400 border border-green-500/30",
  suspendido: "bg-accent-pink/20 text-accent-pink border border-accent-pink/30",
};

const priorityLabels = { alta: "Alta", media: "Media", baja: "Baja" };
const accountStatusLabels = { activo: "Activo", suspendido: "Suspendido" };

export function Badge({ status, priority, sucursalStatus, areaStatus, accountStatus }) {
  if (priority) {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityStyles[priority] || priorityStyles.baja}`}>
        {priorityLabels[priority] || priority}
      </span>
    );
  }

  if (areaStatus) {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${areaStatusStyles[areaStatus] || areaStatusStyles.Inactiva}`}>
        {areaStatus}
      </span>
    );
  }

  if (sucursalStatus) {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sucursalStatusStyles[sucursalStatus] || sucursalStatusStyles.Desactivada}`}>
        {sucursalStatus}
      </span>
    );
  }

  if (accountStatus) {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${accountStatusStyles[accountStatus] || accountStatusStyles.suspendido}`}>
        {accountStatusLabels[accountStatus] || accountStatus}
      </span>
    );
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || statusStyles[TICKET_STATUS.CERRADO]}`}>
      {statusLabels[status] || status}
    </span>
  );
}
