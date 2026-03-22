import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { getEnrichedMockTickets } from "../utils/mockTickets";
import { containsForbiddenInput, normalizeTextInput, validateRequiredText } from "../utils/security";
import { getUserDisplayName } from "../utils/userDisplay";

export function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const ticket = useMemo(() => getEnrichedMockTickets().find((item) => item.id === id), [id]);
  const [comentarios, setComentarios] = useState(() => ticket?.comentarios || []);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [estadoActual, setEstadoActual] = useState(ticket?.estado ?? "abierto");
  const [submittingComment, setSubmittingComment] = useState(false);

  if (!ticket) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-text-primary">Ticket no encontrado</h1>
          <p className="text-text-secondary">No encontramos el ticket numero {id}.</p>
        </div>
        <Button onClick={() => navigate("/tickets")}>Volver a Tickets</Button>
      </div>
    );
  }

  const isAdmin = user?.rol === "admin";
  const isCreator = Number(user?.id) === Number(ticket.encargado_id);
  const isAssignedTechnician = Number(user?.id) === Number(ticket.tecnico_id);
  const canViewTicket = isAdmin || isCreator || isAssignedTechnician;
  const canChangeStatus = !isAdmin && user?.rol === "tecnico" && isAssignedTechnician;
  const canComment = !isAdmin && (isCreator || isAssignedTechnician);

  useEffect(() => {
    if (!canViewTicket) {
      toast.error("No tienes permisos para realizar esta accion", {
        description: "La apertura directa por URL fue bloqueada para este ticket.",
        id: `ticket-denied:${id}`,
      });
    }
  }, [canViewTicket, id]);

  if (!canViewTicket) {
    return <Navigate to="/acceso-denegado" replace state={{ from: `/tickets/${id}` }} />;
  }

  const handleAgregarComentario = () => {
    if (!canComment || submittingComment) return;

    if (containsForbiddenInput(nuevoComentario)) {
      toast.error("Deteccion de caracteres no permitidos", {
        description: "El comentario incluye HTML o contenido que podia interpretarse como codigo ejecutable.",
      });
      return;
    }

    const commentError = validateRequiredText(nuevoComentario, { min: 3, max: 600 });
    if (commentError) {
      toast.info(commentError === "Este campo es obligatorio" ? "Escribe un comentario antes de enviarlo" : commentError);
      return;
    }

    setSubmittingComment(true);

    try {
      setComentarios((prev) => [
        {
          autor: getUserDisplayName(user),
          fecha: new Date().toISOString().split("T")[0],
          texto: normalizeTextInput(nuevoComentario),
        },
        ...prev,
      ]);
      setNuevoComentario("");
      toast.success("Comentario agregado", {
        description: "Tu actualizacion ya es visible en el historial.",
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCommentChange = (value) => {
    if (containsForbiddenInput(value)) {
      toast.error("Deteccion de caracteres no permitidos", {
        description: "No se permiten etiquetas HTML ni caracteres que puedan ejecutarse en comentarios.",
      });
      return;
    }

    setNuevoComentario(value);
  };

  const handleChangeStatus = (nextStatus) => {
    if (!canChangeStatus) return;

    setEstadoActual(nextStatus);
    toast.info(`Estado actualizado a ${formatStatus(nextStatus)}`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex w-full items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate("/tickets")}
            className="mt-1 rounded-xl glass-card p-2 text-text-secondary transition-all hover:border-purple-electric hover:text-text-primary"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-text-primary">{ticket.titulo}</h1>
            <p className="text-sm text-text-muted">
              Ticket #{ticket.id} - Creado el {ticket.fechaCreacion}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">Estado:</span>
          <Badge status={estadoActual} />
          <span className="text-sm text-text-muted">Prioridad:</span>
          <Badge priority={ticket.prioridad} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="mb-4 text-lg font-semibold text-text-primary">Descripcion</h3>

            {canChangeStatus && (
              <div className="mb-4 flex flex-wrap gap-2">
                {[
                  { value: "abierto", label: "Abierto" },
                  { value: "en_proceso", label: "En proceso" },
                  { value: "cerrado", label: "Cerrado" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChangeStatus(option.value)}
                    className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                      estadoActual === option.value
                        ? "border-purple-electric/40 bg-purple-electric/20 text-purple-electric"
                        : "border-white/10 bg-white/5 text-text-secondary hover:bg-white/10"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {!canChangeStatus && !isAdmin && user?.rol === "tecnico" && (
              <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-muted">
                Solo el tecnico asignado puede actualizar el estado de este ticket.
              </div>
            )}

            {isAdmin && (
              <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-muted">
                El administrador solo supervisa este ticket y no puede modificar su estado.
              </div>
            )}

            <p className="whitespace-pre-wrap leading-relaxed text-text-secondary">{ticket.descripcion}</p>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h3 className="mb-4 text-lg font-semibold text-text-primary">Comentarios</h3>

            <div className="mb-4 max-h-48 space-y-3 overflow-y-auto">
              {comentarios.length === 0 ? (
                <p className="py-4 text-center text-sm text-text-muted">No hay comentarios</p>
              ) : (
                comentarios.map((comentario, index) => (
                  <div key={index} className="rounded-xl bg-dark-purple-900/50 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-text-primary">{comentario.autor}</span>
                      <span className="text-xs text-text-muted">{comentario.fecha}</span>
                    </div>
                    <p className="text-sm text-text-secondary">{comentario.texto}</p>
                  </div>
                ))
              )}
            </div>

            {canComment && (
              <div className="border-t border-dark-purple-700 pt-4">
                <label className="mb-2 block text-xs uppercase tracking-wider text-text-muted">Agregar Comentario</label>
                <div className="flex items-start gap-2">
                  <textarea
                    value={nuevoComentario}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    rows={2}
                    maxLength={600}
                    className="min-h-[50px] max-h-[200px] flex-1 resize-none overflow-y-auto rounded-xl border border-dark-purple-700 bg-dark-purple-800 p-3 text-sm text-text-secondary outline-none placeholder:text-text-muted/50 focus:border-purple-electric focus:ring-1 focus:ring-purple-electric"
                    placeholder="Escribe un comentario..."
                  />
                  <Button
                    variant="secondary"
                    onClick={handleAgregarComentario}
                    disabled={!nuevoComentario.trim() || submittingComment}
                    className="h-[50px] px-4"
                  >
                    {submittingComment ? "Validando..." : "Enviar"}
                  </Button>
                </div>
              </div>
            )}

            {!canComment && !isAdmin && (
              <div className="border-t border-dark-purple-700 pt-4 text-sm text-text-muted">
                Solo el encargado creador o el tecnico asignado pueden agregar comentarios en esta vista.
              </div>
            )}

            {isAdmin && (
              <div className="border-t border-dark-purple-700 pt-4 text-sm text-text-muted">
                El administrador puede revisar el historial, pero no agregar comentarios.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="mb-4 text-lg font-semibold text-text-primary">Participantes</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Encargado</span>
                <span className="text-text-primary">{ticket.encargado}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Tecnico</span>
                <span className="text-text-primary">{ticket.tecnico || "Sin asignar"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Area</span>
                <span className="text-text-primary">{ticket.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Sucursal</span>
                <span className="text-text-primary">{ticket.sucursal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Contacto</span>
                <span className="text-text-primary">{ticket.contacto}</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">Historial</h2>
            <div className="relative ml-3 space-y-6 border-l border-dark-purple-700">
              {ticket.historial.slice().reverse().map((item, index) => (
                <div key={index} className="relative pl-6">
                  <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-purple-electric ring-4 ring-dark-purple-900" />
                  <p className="text-sm text-text-secondary">{item.accion}</p>
                  <span className="text-xs text-text-muted">{item.fecha}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatStatus(status) {
  if (status === "en_proceso") return "En proceso";
  return status.charAt(0).toUpperCase() + status.slice(1);
}
