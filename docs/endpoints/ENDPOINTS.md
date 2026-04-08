# Endpoints API Backend - IT Support

Base URL: `https://exquisite-creativity-production.up.railway.app/api`
**Auth**: Bearer token (sessionStorage).

## Autenticación
- **POST /auth/login**
  - Body: `{ email, password }`
  - Response: `{ token, user }`

## Tickets
- **GET /tickets** (ADMIN): Todos
- **GET /tickets/{id}**: Detalle
- **POST /tickets**: Crear (encargado)
- **GET /tickets/disponibles** (tecnico): Para tomar
- **GET /tickets/mis-tickets** (tecnico): Asignados
- **GET /tickets/mis-creados** (encargado): Propios
- **POST /tickets/asignar** Body `{ ticketId, tecnicoId }`
- **PUT /tickets/{id}/cerrar** params `tecnicoId`
- **POST /tickets/asignacion-automatica**

## Comentarios
- **GET /tickets/{id}/comentarios**
- **POST /tickets/{id}/comentarios** Body `{ contenido, ticket_id, usuario_id }`

## Usuarios
- **GET /usuarios** (ADMIN)
- **GET /usuarios/{id}**
- **POST /usuarios/registro**
- **GET /usuarios/me**
- **PUT /usuarios/me** Body `{ nombreUsuario, apellidoPaterno, apellidoMaterno }`
- **PUT /usuarios/admin/{id}** (ADMIN) Body `{ nombreUsuario, apellidoPaterno, ..., rol, email, contrasena? }`
- **PUT /usuarios/{id}/suspender**
- **PUT /usuarios/{id}/activar**
- **GET /usuarios/tecnicos-activos**

## Áreas
- **GET /areas**
- **GET /areas/{id}**
- **POST /areas**
- **PUT /areas/{id}**
- **PUT /areas/{id}/suspender**
- **PUT /areas/{id}/activar**

## Sucursales
- **GET /sucursales**
- **GET /sucursales/{id}**
- **POST /sucursales**
- **PUT /sucursales/{id}**
- **PUT /sucursales/{id}/suspender**
- **PUT /sucursales/{id}/activar**

## WebSocket
- **/api/ws** (SockJS/STOMP) ?token=Bearer

**Fuente**: services/*.js actual.

**Actualizado**: Oct 2024

