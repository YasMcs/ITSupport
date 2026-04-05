# Frontend: Flujo, Roles, Permisos y Validaciones

## Objetivo
Resume estado actual del frontend, flujos, permisos por rol, validaciones y dependencias backend.

---

## Estado del enrutado

### Inicio
- `/` → `/login`.

### ProtectedRoute (habilitada)
- !auth → `/login`
- !allowedRoles → `/acceso-denegado`
- OK → AppLayout + children

### Rutas protegidas
- `/dashboard`, `/tickets`, `/perfil`: todos auth.
- `/usuarios`, `/sucursales`, `/areas`: admin only.
- `/tickets/nuevo`: encargado only.

---

## Roles
`admin`, `tecnico`, `encargado` (lowercase).

---

## UX/Feedback
**Loading:** "Cargando..." Dashboard/Tickets/Estadisticas.

**Empty:** "No hay tickets/comentarios", "Todo al día".

**Error:** toasts sonner (API, auth, input) via feedback.js.

**Confirm:** Directo con toast (close ticket, comment); no modales aún.

---

## Login/Sesión
- `/login`: email/password, sanitiza, token/sessionStorage.
- Correcto → `/dashboard`.
- Error → inline toast.

Logout → clear token/session → /login.

---

## Usuarios (admin)
Listado: tecnico/encargado (no admin).

Crear: nombre/apellidos/email/password/rol/area (encargado).

Editar: nombre/apellidos/email/password (rol fijo).

Suspend/activate: modal confirm.

---

## Sucursales/Areas (admin)
CRUD full, activate/deactivate, refresco list post-action.

---

## Tickets
**Encargado:** create (`/tickets/nuevo`), view created (`/tickets/mis-creados`).

**Tecnico:** disponibles (`/tickets/disponibles`), mis (`/tickets/mis-tickets`), take, comment, close detail.

**Admin:** global list (`/tickets`).

**Detail (`/tickets/:id`):** load por rol, comment (creator/technician), close (assigned tecnico, en_proceso/abierto).

---

## Dashboard/Estadisticas
Scoped by role (`getScoped`), KPIs real data (abiertos/en_proceso/cerrados/total), priority bars, areas top.

---

## Navbar
Sin notificaciones aún.

---

## Validaciones Frontend
Obligatorios, length, email, no-forbidden content, role-conditionals (area for encargado).

---

## Dependencias Backend
Admin tickets global (403?), richer DTOs (historial/contact).

**Resumen:** Login/protected routes OK, CRUD users/suc/areas/tickets, detail/close/comment functional, dashboards scoped. Ready.


