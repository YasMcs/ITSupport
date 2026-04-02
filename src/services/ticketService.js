import { api, extractData } from "./api";
import { buildTicketPayload, normalizeTicket } from "../utils/apiMappers";
import { ROLES } from "../constants/roles";

export const ticketService = {
  async getAll() {
    const response = await api.get("/tickets");
    const tickets = extractData(response);
    return (Array.isArray(tickets) ? tickets : []).map(normalizeTicket);
  },

  async getById(id) {
    const response = await api.get(`/tickets/${id}`);
    return normalizeTicket(extractData(response));
  },

  async create(payload) {
    const response = await api.post("/tickets", buildTicketPayload(payload));
    return normalizeTicket(extractData(response));
  },

  async getAvailable() {
    const response = await api.get("/tickets/disponibles");
    const tickets = extractData(response);
    return (Array.isArray(tickets) ? tickets : []).map(normalizeTicket);
  },

  async getMineAssigned() {
    const response = await api.get("/tickets/mis-tickets");
    const tickets = extractData(response);
    return (Array.isArray(tickets) ? tickets : []).map(normalizeTicket);
  },

  async getMineCreated() {
    const response = await api.get("/tickets/mis-creados");
    const tickets = extractData(response);
    return (Array.isArray(tickets) ? tickets : []).map(normalizeTicket);
  },

  async getScoped(role) {
    if (role === ROLES.TECNICO) return this.getMineAssigned();
    if (role === ROLES.ENCARGADO) return this.getMineCreated();
    return this.getAll();
  },

  async assign(payload) {
    const response = await api.post("/tickets/asignar", payload);
    return normalizeTicket(extractData(response));
  },

  async close(id, tecnicoId) {
    const response = await api.put(`/tickets/${id}/cerrar`, null, {
      params: { tecnicoId },
    });
    return normalizeTicket(extractData(response));
  },

  async autoAssign() {
    const response = await api.post("/tickets/asignacion-automatica");
    return extractData(response);
  },
};
