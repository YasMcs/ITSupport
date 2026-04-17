# Auditoria Breve de Seguridad Frontend

## Objetivo
Documento corto para identificar el estado actual de seguridad del frontend, sus fortalezas, sus riesgos y las acciones que conviene tomar para mejorar integridad, control de acceso y reduccion de superficie de ataque.

## Resumen ejecutivo
El frontend actual tiene una base razonable de seguridad para experiencia de usuario, validaciones y control visual de acceso. Sin embargo, todavia depende de forma importante del backend para la proteccion real.

Hoy el mayor riesgo no esta en la UI visible, sino en:
- manejo del token
- autenticacion del websocket
- exposicion del token en URL del socket

## Fortalezas actuales

### 1. Rutas protegidas por autenticacion y rol
- El frontend no deja navegar libremente a vistas protegidas.
- `ProtectedRoute` controla acceso por sesion y por rol.

### 2. Token centralizado en cliente HTTP
- El token se inyecta desde un solo lugar en `api.js`.
- Esto reduce errores de manejo disperso.
- Se usa `axios` con interceptores para centralizar request y respuesta.

### 3. Validaciones y sanitizacion
- Existe una capa de utilidades en `security.js`.
- Se bloquea contenido sospechoso como:
  - etiquetas HTML
  - `javascript:`
  - eventos inline
  - fragmentos con apariencia de script

### 4. No se detecta render inseguro de HTML
- La app actual trabaja principalmente con texto plano.
- No hay una dependencia visible de render HTML crudo en vistas clave.

### 5. Sesion menos persistente que `localStorage`
- El token se guarda en `sessionStorage`.
- Eso reduce persistencia entre sesiones respecto a `localStorage`.

### 6. La app ya reacciona ante sesion invalida o expirada
- Si el token ya esta vencido al abrir la app, la sesion local se limpia.
- Si una request protegida responde `401` o `403`, el frontend:
  - limpia token
  - limpia sesion
  - muestra aviso breve
  - obliga a volver a login

### Librerias y funciones conocidas usadas aqui
- `axios`
  - para cliente HTTP e interceptores globales
- `sessionStorage`
  - para persistencia corta de token y sesion
- `sonner`
  - para mostrar el aviso de sesion expirada
- funciones propias:
  - `sanitizeSessionUser`
  - `parseJwtPayload`
  - `isTokenExpired`
  - `subscribeToAuthFailures`

## Ofuscación IDs en URLs (Nueva capa)

**Implementado**: `src/utils/cryptoUtils.js`:
- `encodeId(id)` → Base64 obfuscado con salt secreto frontend (`ITSupportSec2024!`).
- `decodeId(hash)` → ID real para API calls.
- Ej: /tickets/1 → /tickets/SVRTdXBwb3J0U2VjMjAyNCE=

**Aplicado en**:
- Tables: TicketsPage, UsuariosPage, AreasPage, SucursalesPage (navigate encoded).
- Details/Edits: *DetailPage, *EditarPage (decode para services).

**Beneficio**: Oculta IDs secuenciales, dificulta enum/guessing. Frontend-only (backend sin cambios).

**Limitación**: Base64 reversible, no cripto fuerte. OK para obfuscación casual.

## Riesgos detectados

## Riesgo alto

### Token en `sessionStorage`
- Si un atacante logra inyectar JavaScript en la aplicacion, el token puede ser leido.
- `sessionStorage` no protege frente a XSS.

### Token del websocket en query string
- El websocket actual construye la URL con `?token=...`.
- Eso puede terminar:
  - en logs
  - en herramientas de monitoreo
  - en historiales internos de red o proxy

## Riesgo medio

### La proteccion por rol del frontend no es defensa real
- Ocultar rutas o botones no impide que alguien intente requests manuales.
- El backend debe seguir siendo la unica autoridad real.

### `403` usado como sesion invalida depende del contrato backend
- El frontend hoy trata `401` y `403` como fallo de autenticacion en requests protegidas.
- Esto fue adaptado porque el backend actual responde `403` con token invalido.
- Si backend separa mejor `401` de `403`, convendra refinar esta regla.

## Riesgo medio-bajo

### Sanitizacion basada en regex
- Ayuda mucho como primera barrera de UX.
- No debe considerarse defensa final.
- La validacion fuerte debe existir tambien en backend.

## Confirmación Ultra-Segura en Formularios (Nueva capa)

**Implementado**: Modales de confirmación dual en formularios críticos.

### Aplicado a
- `UsuarioForm` (crear/editar usuarios)
- `AreaForm` (crear/editar áreas)
- `SucursalForm` (crear/editar sucursales)

### Mecanismo
1. **Validación**: Frontend valida reglas básicas (emails, campos requeridos, caracteres).
2. **Modal de confirmación**: Antes de enviar a API, se abre un modal explícito.
   - Título: "¿Confirmar cambios?" o "¿Descartar cambios?"
   - Mensaje claro: Advierte sobre irreversibilidad.
   - Dos botones: "Revisar" (secundario) o "Confirmar y Guardar" (azul eléctrico).
3. **Descarte confirmado**: Botón "Cancelar" abre un segundo modal.
   - Título: "¿Descartar cambios?"
   - Mensaje claro: Advierte sobre pérdida de datos.
   - Dos botones: "Seguir editando" (secundario) o "Descartar" (rojo/rosa).

### Beneficio de seguridad
- **Mitiga acciones accidentales**: Usuario debe confirmar 2 veces antes de guardar o descartar.
- **Interfaz clara**: Colores diferenciados (azul para guardar, rojo para descartar) ayudan a la intención.
- **No es cripto, es UX**: La confirmación es barrera visual y funcional, no sustituto de validación backend.

### Exceso de datos en payloads o eventos
- Si backend manda mas datos de los necesarios en tickets o sockets, el frontend no los filtra de forma estricta.
- Conviene seguir revisando que DTOs traigan solo lo necesario.

## Cosas que el frontend si puede proteger mejor

## 1. Mejor manejo del token

### Recomendacion ideal
- mover autenticacion a cookie `HttpOnly` si backend lo permite

### Si por ahora no se puede
- mantener `sessionStorage` pero:
  - minimizar tiempo de vida del token
  - limpiar sesion en expiracion
  - evitar exponerlo en URL

## 2. No mandar token por query string en websocket
- Lo ideal es autenticar el socket por:
  - headers
  - cookie de sesion
  - handshake del backend
- Si backend ya admite headers STOMP o autenticacion por cookie, quitar `?token=...`

## 3. Refinar diferenciacion entre `401` y `403`
- Hoy el frontend soporta ambas por compatibilidad.
- Idealmente:
  - `401` = token invalido o vencido
  - `403` = usuario autenticado sin permiso

## 4. Validar expiracion al iniciar la app
- Ya se implemento lectura del `exp` del JWT.
- Conviene mantener esta logica alineada con el formato real del token backend.

## 5. Seguir evitando HTML inseguro
- Mantener la regla de no usar `dangerouslySetInnerHTML` salvo que sea absolutamente necesario.
- Si algun dia se necesita, sanitizar con una libreria seria y no con regex casero.

## 6. Limitar persistencia de informacion sensible en memoria visual
- Evitar mostrar o conservar datos sensibles no necesarios en contexto global.
- Mantener DTOs y estados de UI lo mas minimos posible.

## 7. Endurecer navegacion sensible
- En vistas con acciones criticas:
  - confirmar cierres o cambios destructivos
  - invalidar acciones repetidas
  - bloquear dobles submits
- Esto protege mas la integridad operativa que la seguridad dura, pero sigue siendo importante.

## 8. Cuidar la bandeja de notificaciones
- No mostrar detalles excesivos en toasts o campanita.
- Usar copy breve y folio, no informacion sensible o interna.

## Recomendaciones por prioridad

### Prioridad alta
- quitar token del query string del websocket
- mover el websocket a autenticacion por header o cookie
- confirmar contrato backend final de `401` vs `403`

### Prioridad media
- revisar si `sessionStorage` puede migrarse a cookie segura
- limitar payloads de notificaciones y DTOs
- seguir auditando formularios que aceptan texto libre

### Prioridad baja
- documentar politica de seguridad frontend
- revisar headers de seguridad del deploy junto con backend

## Control de Roles y Permisos

Ver [ROLES-PERMISSIONS.md](../roles/ROLES-PERMISSIONS.md) para detalles completos por rol (ADMIN, TECNICO, ENCARGADO).

## Conclusion
El frontend actual no esta inseguro de forma alarmante, pero tampoco esta en un punto de seguridad madura completa.

La base es buena en:
- estructura
- validaciones
- control visual de acceso **por rol**
- orden de sesion y rutas

Los siguientes saltos reales de seguridad estan en:
- token
- websocket

Si esos puntos se corrigen, la postura general del frontend sube bastante.

