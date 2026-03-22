export const PRIORIDAD = {
  ALTA: "alta",
  MEDIA: "media",
  BAJA: "baja",
};

export const PRIORIDAD_OPTIONS = [
  { value: PRIORIDAD.BAJA, label: "Baja" },
  { value: PRIORIDAD.MEDIA, label: "Media" },
  { value: PRIORIDAD.ALTA, label: "Alta" },
];

export const getPriorityConfig = (prioridad) => {
  switch (prioridad) {
    case PRIORIDAD.ALTA:
      return {
        color: "text-red-300",
        bg: "bg-red-500/90",
        ring: "ring-red-400/40",
        dot: "bg-red-400",
        label: "Alta",
      };
    case PRIORIDAD.MEDIA:
      return {
        color: "text-amber-300",
        bg: "bg-amber-500/90",
        ring: "ring-amber-400/40",
        dot: "bg-amber-400",
        label: "Media",
      };
    case PRIORIDAD.BAJA:
      return {
        color: "text-emerald-300",
        bg: "bg-emerald-500/90",
        ring: "ring-emerald-400/40",
        dot: "bg-emerald-400",
        label: "Baja",
      };
    default:
      return {
        color: "text-amber-300",
        bg: "bg-amber-500/90",
        ring: "ring-amber-400/40",
        dot: "bg-amber-400",
        label: "Media",
      };
  }
};
