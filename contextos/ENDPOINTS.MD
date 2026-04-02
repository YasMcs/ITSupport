# Documentación de Endpoints

Base path: `/api`

---

## Cuerpos JSON para POST / PUT / DELETE
La siguiente lista muestra el JSON de ejemplo que se debe enviar para cada endpoint que acepta body (POST/PUT). Para endpoints que usan `query params` o `path params` se muestra el ejemplo de URL y una alternativa JSON sugerida cuando aplica.

- `POST /api/auth/login` (body):

```json
{
  "email": "user@example.com",
  "contrasena": "miContraseña123"
}
```

- `POST /api/usuarios/registro` (body):

```json
{
  "nombreUsuario": "juan",
  "email": "juan@example.com",
  "contrasena": "secret123",
  "rol": "ENCARGADO",
  "areaId": 2
}
```

- `PUT /api/usuarios/{id}/contrasena` (usa query params):

URL ejemplo:

```
/api/usuarios/5/contrasena?contrasenaActual=oldPass&contrasenaNueva=newPass
```

Alternativa JSON (si se enviara body):

```json
{
  "contrasenaActual": "oldPass",
  "contrasenaNueva": "newPass"
}
```

- `PUT /api/usuarios/{id}/suspender` y `PUT /api/usuarios/{id}/activar` (sin body):

No requieren body, sólo llamar la URL con el `id`.

- `PUT /api/usuarios/me` (body):

```json
{
  "nombreUsuario": "nuevoNombre"
}
```

- `POST /api/tickets` (body):

```json
{
  "titulo": "Impresora no funciona",
  "descripcion": "La impresora en la sucursal X no imprime",
  "prioridad": "ALTA",
  "encargadoId": 7,
  "areaId": 3
}
```

- `POST /api/tickets/asignar` (body):

```json
{
  "ticketId": 101,
  "tecnicoId": 15
}
```

- `PUT /api/tickets/{id}/cerrar` (usa query param `tecnicoId`):

URL ejemplo:

```
/api/tickets/101/cerrar?tecnicoId=15
```

Alternativa JSON (no usada por controlador):

```json
{
  "tecnicoId": 15
}
```

- `POST /api/tickets/asignacion-automatica` (sin body):

No requiere body; se invoca la ruta para disparar la lógica.

- `POST /api/comentarios` (body):

```json
{
  "contenido": "Revisado y en proceso",
  "ticketId": 101,
  "usuarioId": 15
}
```

- `POST /api/sucursales` (body):

```json
{
  "nombre": "Sucursal Centro"
}
```

- `PUT /api/sucursales/{id}` (usa query param `nuevoNombre`):

URL ejemplo:

```
/api/sucursales/3?nuevoNombre=Sucursal%20Norte
```

Alternativa JSON (no usada por controlador):

```json
{
  "nuevoNombre": "Sucursal Norte"
}
```

- `PUT /api/sucursales/{id}/desactivar` y `PUT /api/sucursales/{id}/activar` (sin body):

No requieren body.

- `POST /api/areas` (body):

```json
{
  "nombre": "Soporte",
  "sucursalId": 1
}
```

- `PUT /api/areas/{id}` (usa query param `nuevoNombre`):

URL ejemplo:

```
/api/areas/5?nuevoNombre=Soporte%20Central
```

Alternativa JSON (no usada por controlador):

```json
{
  "nuevoNombre": "Soporte Central"
}
```

- `PUT /api/areas/{id}/desactivar` y `PUT /api/areas/{id}/activar` (sin body):

No requieren body.

- `POST /api/areas/{areaId}/asignar-encargado/{usuarioId}` (sin body):

No requiere body — los `areaId` y `usuarioId` van en la URL.

---

Si quieres que convierta los endpoints que usan `query params` a recibir JSON en el body (y actualice los controladores), puedo hacerlo — dime si quieres ese cambio.

## Auth

### POST /api/auth/login
- Descripción: Autentica un usuario y devuelve un token JWT.
- Request body (JSON):

```json
{
  "email": "user@example.com",
  "contrasena": "miContraseña123"
}
```

- Response 200 (LoginResponseDTO):

```json
{
  "id": 1,
  "nombreUsuario": "Juan Perez",
  "email": "user@example.com",
  "rol": "ADMIN",
  "token": "eyJhbGciOi...",
  "mensaje": "Autenticación correcta"
}
```

---

## Usuarios (`/api/usuarios`)

### POST /api/usuarios/registro
- Descripción: Registrar un nuevo usuario.
- Request body (CrearUsuarioRequest):

```json
{
  "nombreUsuario": "juan",
  "email": "juan@example.com",
  "contrasena": "secret123",
  "rol": "ENCARGADO",
  "areaId": 2
}
```

- Response 201 (UsuarioResponseDTO):

```json
{
  "id": 12,
  "nombreUsuario": "juan",
  "email": "juan@example.com",
  "rol": "ENCARGADO",
  "estadoCuenta": "ACTIVO",
  "areaNombre": "Soporte",
  "areaId": 2,
  "ticketsActivos": 0,
  "ticketsCreados": 0,
  "ticketsResueltos": 0
}
```

### GET /api/usuarios/{id}
- Descripción: Obtener usuario por `id`.
- Autorización: `ADMIN`
- Path params: `id` (Long)
- Response 200 (UsuarioResponseDTO): same as ejemplo anterior.

### GET /api/usuarios
- Descripción: Listar todos los usuarios.
- Autorización: `ADMIN`
- Response 200: Array de `UsuarioResponseDTO`.

### GET /api/usuarios/tecnicos-activos
- Descripción: Listar técnicos activos.
- Autorización: `ADMIN`
- Response 200: Array de `UsuarioResponseDTO`.

### PUT /api/usuarios/{id}/suspender
- Descripción: Suspender cuenta de usuario.
- Autorización: `ADMIN`
- Path params: `id`
- Response 200: `UsuarioResponseDTO` actualizado.

### PUT /api/usuarios/{id}/activar
- Descripción: Activar cuenta de usuario.
- Autorización: `ADMIN`
- Path params: `id`
- Response 200: `UsuarioResponseDTO` actualizado.

### PUT /api/usuarios/{id}/contrasena
- Descripción: Cambiar contraseña (admin o el propio usuario).
- Path params: `id`
- Query params: `contrasenaActual`, `contrasenaNueva`
- Ejemplo de uso (URL): `/api/usuarios/5/contrasena?contrasenaActual=old&contrasenaNueva=new`
- Response 200 (mensaje):

```json
{
  "mensaje": "Contraseña actualizada correctamente"
}
```

### GET /api/usuarios/me
- Descripción: Obtener perfil del usuario autenticado.
- Autorización: cualquier usuario autenticado
- Response 200: `UsuarioResponseDTO` del usuario autenticado.

### PUT /api/usuarios/me
- Descripción: Actualizar perfil del usuario autenticado.
- Request body (UsuarioUpdateRequest):

```json
{
  "nombreUsuario": "nuevoNombre"
}
```

- Response 200: `UsuarioResponseDTO` actualizado.

---

## Tickets (`/api/tickets`)

### POST /api/tickets
- Descripción: Crear un ticket (solo `ENCARGADO`).
- Request body (CrearTicketRequest):

```json
{
  "titulo": "Impresora no funciona",
  "descripcion": "La impresora en la sucursal X no imprime",
  "prioridad": "ALTA",
  "encargadoId": 7,
  "areaId": 3
}
```

- Response 201 (TicketResponseDTO):

```json
{
  "id": 101,
  "titulo": "Impresora no funciona",
  "descripcion": "La impresora en la sucursal X no imprime",
  "prioridad": "ALTA",
  "estado": "ABIERTA",
  "tipoAsignacion": "MANUAL",
  "fechaCreacion": "2026-04-01T10:00:00",
  "fechaAsignacion": null,
  "fechaCierre": null,
  "encargadoNombre": "Ana",
  "encargadoEmail": "ana@example.com",
  "encargadoId": 7,
  "areaNombre": "Soporte",
  "areaId": 3,
  "sucursalNombre": "Sucursal Centro",
  "sucursalId": 1,
  "tecnicoNombre": null,
  "tecnicoId": null,
  "minutosEsperando": 15,
  "numeroComentarios": 0,
  "esVencido": false
}
```

### GET /api/tickets/{id}
- Descripción: Obtener ticket por `id`.
- Autorización: `TECNICO`
- Response 200: `TicketResponseDTO`.

### GET /api/tickets
- Descripción: Listar todos los tickets.
- Autorización: `TECNICO`
- Response 200: Array de `TicketResponseDTO`.

### GET /api/tickets/disponibles
- Descripción: Tickets disponibles para técnicos.
- Autorización: `TECNICO`
- Response 200: Array de `TicketResponseDTO`.

### POST /api/tickets/asignar
- Descripción: Asignar ticket a técnico (body `AsignarTicketRequest`).
- Request body:

```json
{
  "ticketId": 101,
  "tecnicoId": 15
}
```

- Response 200: `TicketResponseDTO` asignado.

### PUT /api/tickets/{id}/cerrar
- Descripción: Cerrar un ticket.
- Autorización: `TECNICO`
- Path params: `id`
- Query params: `tecnicoId`
- Ejemplo de uso: `/api/tickets/101/cerrar?tecnicoId=15`
- Response 200: `TicketResponseDTO` cerrado (con `fechaCierre`).

### POST /api/tickets/asignacion-automatica
- Descripción: Ejecuta asignación automática de tickets.
- Response 200: Texto con número de tickets asignados.

### GET /api/tickets/mis-tickets
- Descripción: Tickets asignados al técnico autenticado.
- Autorización: `TECNICO`
- Response 200: Array de `TicketResponseDTO`.

### GET /api/tickets/mis-creados
- Descripción: Tickets creados por el encargado autenticado.
- Autorización: `ENCARGADO`
- Response 200: Array de `TicketResponseDTO`.

### GET /api/tickets/encargado/{id}
- Descripción: Tickets asociados a un encargado (por id).
- Autorización: `ADMIN`
- Response 200: Array de `TicketResponseDTO`.

---

## Comentarios (`/api/comentarios`)

### POST /api/comentarios
- Descripción: Crear un comentario para un ticket.
- Autorización: `ENCARGADO` o `TECNICO`
- Request body (CrearComentarioRequest):

```json
{
  "contenido": "Revisado y en proceso",
  "ticketId": 101,
  "usuarioId": 15
}
```

- Response 201 (ComentarioResponseDTO):

```json
{
  "id": 501,
  "contenido": "Revisado y en proceso",
  "fechaCreacion": "2026-04-01T11:00:00",
  "ticketId": 101,
  "ticketTitulo": "Impresora no funciona",
  "usuarioId": 15,
  "usuarioNombre": "Luis",
  "usuarioRol": "TECNICO"
}
```

### GET /api/comentarios/ticket/{ticketId}
- Descripción: Obtener todos los comentarios de un ticket.
- Autorización: cualquier usuario autenticado
- Response 200: Array de `ComentarioResponseDTO`.

---

## Sucursales (`/api/sucursales`)

### GET /api/sucursales/ping
- Descripción: Endpoint de ping (dev).
- Response 200: Texto `pong`.

### POST /api/sucursales
- Descripción: Crear sucursal (ADMIN).
- Request body (CrearSucursalRequest):

```json
{
  "nombre": "Sucursal Centro"
}
```

- Response 201 (SucursalResponseDTO):

```json
{
  "id": 1,
  "nombre": "Sucursal Centro",
  "estado": "ACTIVA",
  "totalAreas": 3,
  "totalTickets": 42,
  "areasNombres": ["Soporte","Ventas","RRHH"]
}
```

### GET /api/sucursales/{id}
- Descripción: Obtener sucursal por `id` (ADMIN).
- Response 200: `SucursalResponseDTO`.

### GET /api/sucursales
- Descripción: Listar todas las sucursales (ADMIN).
- Response 200: Array de `SucursalResponseDTO`.

### GET /api/sucursales/activas
- Descripción: Listar sucursales activas (ADMIN).
- Response 200: Array de `SucursalResponseDTO`.

### PUT /api/sucursales/{id}
- Descripción: Actualizar nombre de la sucursal (ADMIN).
- Query params: `nuevoNombre` (String)
- Response 200: `SucursalResponseDTO` actualizado.

### PUT /api/sucursales/{id}/desactivar
- Descripción: Desactivar sucursal (ADMIN).
- Response 200: `SucursalResponseDTO` actualizado.

### PUT /api/sucursales/{id}/activar
- Descripción: Activar sucursal (ADMIN).
- Response 200: `SucursalResponseDTO` actualizado.

---

## Áreas (`/api/areas`)

### POST /api/areas
- Descripción: Crear un área (ADMIN).
- Request body (CrearAreaRequest):

```json
{
  "nombre": "Soporte",
  "sucursalId": 1
}
```

- Response 201 (AreaResponseDTO):

```json
{
  "id": 3,
  "nombre": "Soporte",
  "estado": "ACTIVA",
  "sucursalId": 1,
  "sucursalNombre": "Sucursal Centro",
  "totalTickets": 20,
  "encargadoNombre": "Ana"
}
```

### GET /api/areas/{id}
- Descripción: Obtener área por `id` (ADMIN).
- Response 200: `AreaResponseDTO`.

### GET /api/areas
- Descripción: Listar todas las áreas (ADMIN).
- Response 200: Array de `AreaResponseDTO`.

### GET /api/areas/sucursal/{sucursalId}
- Descripción: Listar áreas por sucursal (ADMIN).
- Response 200: Array de `AreaResponseDTO`.

### GET /api/areas/sucursal/{sucursalId}/activas
- Descripción: Listar áreas activas por sucursal (ADMIN).
- Response 200: Array de `AreaResponseDTO`.

### PUT /api/areas/{id}
- Descripción: Actualizar nombre del área (ADMIN).
- Query params: `nuevoNombre`
- Response 200: `AreaResponseDTO` actualizado.

### PUT /api/areas/{id}/desactivar
- Descripción: Desactivar área (ADMIN).
- Response 200: `AreaResponseDTO` actualizado.

### PUT /api/areas/{id}/activar
- Descripción: Activar área (ADMIN).
- Response 200: `AreaResponseDTO` actualizado.

### POST /api/areas/{areaId}/asignar-encargado/{usuarioId}
- Descripción: Asignar un encargado a un área (ADMIN).
- Path params: `areaId`, `usuarioId`
- Response 200: `AreaResponseDTO` con `encargadoNombre` actualizado.

---
