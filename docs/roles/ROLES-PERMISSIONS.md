# Permisos por Rol - Sistema IT Support

## Roles (src/constants/roles.js)
**ADMIN** (`admin`) | **TECNICO** (`tecnico`) | **ENCARGADO** (`encargado`)

## ADMIN (`admin`)
**Puede VER:**
- Dashboard: Todos tickets + métricas sistema
- Tickets: Todos (lista/detalle, **solo lectura**)
- Estadísticas: Completas del sistema
- Áreas, Sucursales, Usuarios: Full (listas/detalles)
- Perfil: Propio

**Puede EDITAR:**
- Áreas (CRUD)
- Sucursales (CRUD)
- Usuarios (CRUD, suspender/activar)
- **NO tickets** (ni crear ni editar)

**Notificaciones WS:**
- Todos topics: nuevos, updates, asignaciones, comentarios

**Opciones/Sidebar:**
- Menú completo (tickets/áreas/sucursales/usuarios/stats/perfil)

## TECNICO (`tecnico`)
**Puede VER:**
- Dashboard: Mis tickets asignados + tracking personal
- Tickets: Solo asignados (lista/detalle)
- Estadísticas: Personales
- Perfil: Propio

**Puede EDITAR:**
- Tickets asignados (comments, status, cerrar)

**Notificaciones WS:**
- Asignaciones a mí
- Comentarios en mis tickets
- Updates en asignados

**Opciones/Sidebar:**
- Tickets, Dashboard personal, Perfil, Tickets disponibles (tomar)

## ENCARGADO (`encargado`)
**Puede VER:**
- Dashboard: Mis tickets + pendientes sin técnico
- Tickets: Solo propios (lista/detalle)
- Estadísticas: Personales pendientes
- Perfil: Propio

**Puede EDITAR:**
- Crear nuevos tickets

**Notificaciones WS:**
- Nuevos tickets en área
- Updates/comentarios en propios tickets

**Opciones/Sidebar:**
- Tickets propios, Nuevo Ticket, Dashboard, Perfil

**Fuente**: Código actual (ProtectedRoute.jsx, NuevoTicketPage.jsx, TicketsPage.jsx, etc.)

**Actualizado**: Octubre 2024
