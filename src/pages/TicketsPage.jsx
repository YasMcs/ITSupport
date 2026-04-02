import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { TicketTable, COLUMN_KEYS } from "../components/tickets/TicketTable";
import { KanbanBoard } from "../components/tickets/KanbanBoard";
import { Button } from "../components/ui/Button";
import { FilterBar } from "../components/ui/FilterBar";
import { ticketService } from "../services/ticketService";

export function TicketsPage() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    estado: "",
    prioridad: "",
    area: "",
    sucursal: "",
    tecnico: "",
  });
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadTickets() {
      setLoading(true);

      try {
        const data = await ticketService.getScoped(role);
        if (!cancelled) setTickets(filterTicketsByRole(data, role, user));
      } catch (error) {
        if (!cancelled) {
          setTickets([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTickets();
    return () => {
      cancelled = true;
    };
  }, [role, user]);

  const handleTicketMove = (ticketId, newStatus) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, estado: newStatus } : ticket))
    );
    toast.success(`Estado actualizado a ${newStatus}`);
  };

  const filteredTickets = useMemo(() => {
    let currentTickets = [...tickets];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      currentTickets = currentTickets.filter((ticket) =>
        [ticket.id, ticket.titulo, ticket.descripcion, ticket.encargado, ticket.tecnico, ticket.area]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      );
    }

    return currentTickets.filter((ticket) => {
      if (role !== ROLES.TECNICO && filters.estado && ticket.estado !== filters.estado) return false;
      if (filters.prioridad && ticket.prioridad !== filters.prioridad) return false;
      if (filters.area && ticket.area !== filters.area) return false;
      if (filters.sucursal && ticket.sucursal !== filters.sucursal) return false;
      if (filters.tecnico && ticket.tecnico !== filters.tecnico) return false;
      return true;
    });
  }, [filters, role, searchQuery, tickets]);

  const getColumns = () => {
    if (role === ROLES.ADMIN) {
      return [COLUMN_KEYS.NUMERO, COLUMN_KEYS.PRIORIDAD, COLUMN_KEYS.ESTADO, COLUMN_KEYS.RESPONSABLE, COLUMN_KEYS.TECNICO, COLUMN_KEYS.FECHA, COLUMN_KEYS.ACCIONES];
    }
    if (role === ROLES.TECNICO) {
      return [COLUMN_KEYS.NUMERO, COLUMN_KEYS.PRIORIDAD, COLUMN_KEYS.ESTADO, COLUMN_KEYS.RESPONSABLE, COLUMN_KEYS.FECHA, COLUMN_KEYS.ACCIONES];
    }
    if (role === ROLES.ENCARGADO) {
      return [COLUMN_KEYS.NUMERO, COLUMN_KEYS.FECHA, COLUMN_KEYS.PRIORIDAD, COLUMN_KEYS.ESTADO, COLUMN_KEYS.TECNICO, COLUMN_KEYS.ACCIONES];
    }
    return [];
  };

  const clearFilters = () => setFilters({ estado: "", prioridad: "", area: "", sucursal: "", tecnico: "" });
  const hasActiveFilters = Object.values(filters).some((value) => value !== "");
  const areaOptions = [...new Set(tickets.map((ticket) => ticket.area).filter(Boolean))];
  const sucursalOptions = [...new Set(tickets.map((ticket) => ticket.sucursal).filter(Boolean))];
  const tecnicoOptions = [...new Set(tickets.map((ticket) => ticket.tecnicoAsignado || ticket.tecnico).filter(Boolean))];

  const getEmptyMessage = () => {
    if (role === ROLES.TECNICO) return "No tienes tickets asignados";
    if (role === ROLES.ENCARGADO) return "Aun no tienes tickets registrados";
    return "No hay tickets registrados";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <h1 className="text-3xl font-bold text-text-primary">Tickets</h1>
          <p className="text-text-secondary mt-1">
            {role === ROLES.ADMIN && "Gestiona todos los tickets del sistema"}
            {role === ROLES.TECNICO && "Tickets asignados a ti"}
            {role === ROLES.ENCARGADO && "Tus tickets registrados"}
          </p>
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tickets..."
              className="w-full bg-dark-purple-800 border border-dark-purple-700 text-text-primary rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-purple-electric focus:border-purple-electric transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {role === ROLES.ADMIN && (
            <Button onClick={() => toast.success("Reporte generado")} variant="secondary">
              Generar reporte
            </Button>
          )}
          {role === ROLES.ENCARGADO && <Button onClick={() => navigate("/tickets/nuevo")}>Nuevo Ticket</Button>}
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((current) => !current)}
        hideStatus={role === ROLES.TECNICO}
        role={role}
        areaOptions={areaOptions}
        sucursalOptions={sucursalOptions}
        tecnicoOptions={tecnicoOptions}
      />

      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-text-secondary text-lg">Cargando tickets...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-16 h-16 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-text-secondary text-lg">{getEmptyMessage()}</p>
          </div>
        </div>
      ) : role === ROLES.TECNICO ? (
        <KanbanBoard tickets={filteredTickets} onTicketMove={handleTicketMove} />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <TicketTable tickets={filteredTickets} columnas={getColumns()} />
        </div>
      )}
    </div>
  );
}

function filterTicketsByRole(tickets, role, user) {
  if (role === ROLES.ADMIN) return tickets;
  if (role === ROLES.TECNICO) return tickets.filter((ticket) => Number(ticket.tecnico_id) === Number(user?.id));
  if (role === ROLES.ENCARGADO) return tickets.filter((ticket) => Number(ticket.encargado_id) === Number(user?.id));
  return [];
}
