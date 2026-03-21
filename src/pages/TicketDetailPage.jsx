import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { getEnrichedMockTickets } from "../utils/mockTickets";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

export function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const ticket = useMemo(() => getEnrichedMockTickets().find((item) => item.id === id), [id]);
  const [comentarios, setComentarios] = useState(() => ticket?.comentarios || []);
  const [nuevoComentario, setNuevoComentario] = useState("");

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Ticket no encontrado</h1>
          <p className="text-text-secondary">El ticket con ID {id} no existe.</p>
        </div>
        <Button onClick={() => navigate("/tickets")}>Volver a Tickets</Button>
      </div>
    );
  }

  const handleAgregarComentario = () => {
    if (!nuevoComentario.trim()) return;

    setComentarios((prev) => [
      {
        autor: user?.nombre_usuario || "sistema",
        fecha: new Date().toISOString().split("T")[0],
        texto: nuevoComentario.trim(),
      },
      ...prev,
    ]);
    setNuevoComentario("");
    toast.success("Comentario agregado");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-start w-full gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate("/tickets")}
            className="p-2 rounded-xl glass-card text-text-secondary hover:text-text-primary hover:border-purple-electric transition-all mt-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-text-primary">{ticket.titulo}</h1>
            <p className="text-sm text-text-muted">Ticket #{ticket.id} • Creado el {ticket.fechaCreacion}</p>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <span className="text-sm text-text-muted">Estado:</span>
          <Badge status={ticket.estado} />
          <span className="text-sm text-text-muted">Prioridad:</span>
          <Badge priority={ticket.prioridad} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Descripcion</h3>
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{ticket.descripcion}</p>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Comentarios</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
              {comentarios.length === 0 ? (
                <p className="text-text-muted text-sm text-center py-4">No hay comentarios</p>
              ) : (
                comentarios.map((comentario, index) => (
                  <div key={index} className="bg-dark-purple-900/50 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-text-primary text-sm font-medium">{comentario.autor}</span>
                      <span className="text-text-muted text-xs">{comentario.fecha}</span>
                    </div>
                    <p className="text-text-secondary text-sm">{comentario.texto}</p>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-dark-purple-700 pt-4">
              <label className="text-xs uppercase tracking-wider text-text-muted mb-2 block">Agregar Comentario</label>
              <div className="flex gap-2 items-start">
                <textarea
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                  rows={2}
                  className="flex-1 min-h-[50px] max-h-[200px] resize-none overflow-y-auto bg-dark-purple-800 text-text-secondary border border-dark-purple-700 rounded-xl p-3 text-sm placeholder:text-text-muted/50 focus:ring-1 focus:ring-purple-electric focus:border-purple-electric outline-none"
                  placeholder="Escribe un comentario..."
                />
                <Button variant="secondary" onClick={handleAgregarComentario} disabled={!nuevoComentario.trim()} className="h-[50px] px-4">
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Participantes</h3>
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
            <h2 className="text-lg font-semibold text-text-primary mb-4">Historial</h2>
            <div className="relative border-l border-dark-purple-700 ml-3 space-y-6">
              {ticket.historial.slice().reverse().map((item, index) => (
                <div key={index} className="relative pl-6">
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-electric ring-4 ring-dark-purple-900" />
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
