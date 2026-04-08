# Permisos por Rol - Sistema IT Support

## Roles definidos (src/constants/roles.js)
- **ADMIN** (`admin`)
- **TECNICO** (`tecnico`)
- **ENCARGADO** (`encargado`)

## Tabla de Permisos

| Acción/Página | ADMIN | TECNICO | ENCARGADO |
|---------------|-------|---------|-----------|
| **Dashboard** | ✅ Todos tickets + system health | ✅ Mis tickets asignados + tracking | ✅ Mis tickets creados + sin atención |
| **Tickets (list)** | ✅ Todos | ✅ Solo asignados a mí | ✅ Solo creados por mí |
| **Nuevo Ticket** | ✅ | ❌ | ✅ |
| **Ticket Detail** | ✅ Todos | ✅ Asignados + own comments | ✅ Creados por mí |
| **Editar Ticket** | ✅ Todos | ✅ Asignados a mí | ❌ |
| **Areas (CRUD)** | ✅ Full | ❌ | ❌ |
| **Sucursales (CRUD)** | ✅ Full | ❌ | ❌ |
| **Usuarios (CRUD)** | ✅ Full (except self) | ❌ | ❌ |
| **Estadísticas** | ✅ Full system | ✅ Personal tracking | ✅ Personal sin atención |
| **Perfil** | ✅ | ✅ | ✅ |
| **Websocket Notifs** | ✅ All topics | ✅ Asignaciones, comments own tickets | ✅ New tickets, updates own |

## Detalles
### ADMIN
- **Ver**: Todo el sistema.
- **Editar**: CRUD areas/sucursales/usuarios/tickets.
- **Notificaciones**: Todos topics (new tickets, updates, asignaciones).
- **Sidebar**: Full menu.

### TECNICO
- **Ver**: Tickets asignados, stats personal.
- **Editar**: Comments en assigned tickets, update status.
- **Notificaciones**: Asignación tickets, comments en mis tickets.
- **Sidebar**: Tickets, Perfil, Dashboard limited.

### ENCARGADO
- **Ver**: Tickets creados por mí, pending sin técnico.
- **Editar**: Crear tickets, assign técnico (if perm).
- **Notificaciones**: New comments/updates en mis tickets.
- **Sidebar**: Tickets (own), Nuevo Ticket, Perfil.

**Fuente**: ProtectedRoute.jsx, role filters en pages (TicketsPage, DashboardPage, etc.), WebSocketContext subscriptions.

Actualizado: [Fecha]

