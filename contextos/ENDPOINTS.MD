# Endpoints API `/api`

## Nuevos/actuales
**GET /api/tickets/mis-tickets** (tecnico): tickets assigned.
**GET /api/tickets/mis-creados** (encargado): created tickets.
**REST anterior intacto** (login, users CRUD, sucursales/areas CRUD, tickets CRUD/asignar/cerrar/comentarios).

**Scoped:** ticketService.getScoped(role) → mis-tickets/creados/all.

Base: railway.app/api, auth Bearer token.

Full doc anterior + estos 2.

