import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { getEnrichedMockTickets } from "../utils/mockTickets";
import { KanbanBoard } from "../components/tickets/KanbanBoard";
import { Button } from "../components/ui/Button";

export function KanbanPage() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState(() => {
    const source = getEnrichedMockTickets();
    if (role === ROLES.ADMIN) return source;
    if (role === ROLES.TECNICO) return source.filter((ticket) => ticket.tecnico_id === user?.id);
    if (role === ROLES.ENCARGADO) return source.filter((ticket) => ticket.encargado_id === user?.id);
    return [];
  });

  const handleTicketMove = (ticketId, newStatus) => {
    setTickets((prev) => prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, estado: newStatus } : ticket)));
    toast.success(`Estado actualizado a ${newStatus}`);
  };

  const getEmptyMessage = () => {
    if (role === ROLES.TECNICO) return "No tienes tickets asignados";
    if (role === ROLES.ENCARGADO) return "Aun no tienes tickets registrados";
    return "No hay tickets disponibles";
  };

  if (!tickets.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-16 h-16 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <p className="text-text-secondary text-lg">{getEmptyMessage()}</p>
            {role === ROLES.ENCARGADO && <Button onClick={() => navigate("/tickets/nuevo")}>Crear Ticket</Button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <h1 className="text-3xl font-bold text-text-primary">Vista Kanban</h1>
          <p className="text-text-secondary mt-1">Arrastra tickets y mantennos alineados con estados SQL en minusculas</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => navigate("/tickets")} variant="secondary">
            Vista Tabla
          </Button>
          {role === ROLES.ENCARGADO && <Button onClick={() => navigate("/tickets/nuevo")}>Nuevo Ticket</Button>}
        </div>
      </div>

      <KanbanBoard tickets={tickets} onTicketMove={handleTicketMove} />
    </div>
  );
}
