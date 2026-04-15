# API Y Realtime

## Objetivo
Documentar como se integra el frontend con backend tanto por HTTP como por WebSocket.

## Capa HTTP
El cliente base vive en [api.js](/c:/Users/yasbe/Downloads/ITSupport/src/services/api.js).

### Que hace `api.js`
- define `baseURL`
- inyecta token Bearer desde `sessionStorage`
- evita enviar token en rutas publicas de autenticacion
- notifica fallos `401/403` a los listeners globales
- expone helpers como `extractData`, `setAuthToken` y `clearAuthToken`

## Servicios por dominio
- `authService.js`
- `ticketService.js`
- `commentService.js`
- `userService.js`
- `areaService.js`
- `sucursalService.js`

La regla general es:
- las paginas consumen servicios
- los servicios consumen `api.js`
- los mappers estabilizan la forma final

## Mapeo de payloads
[apiMappers.js](/c:/Users/yasbe/Downloads/ITSupport/src/utils/apiMappers.js) absorbe variaciones del backend.

Ejemplos:
- nombres de campos alternos
- IDs con distintos nombres
- comentarios y tickets con estructuras heterogeneas

Esto protege a la UI de cambios menores en el contrato.

## Capa WebSocket
La integracion vive en:
- [WebSocketContext.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/context/WebSocketContext.jsx)
- [websocketService.js](/c:/Users/yasbe/Downloads/ITSupport/src/services/websocketService.js)

### Librerias usadas
- `@stomp/stompjs`
- `sockjs-client`

### Flujo general
1. Si hay sesion valida, el provider conecta.
2. Se suscribe a topics globales.
3. Se construyen notificaciones legibles para la UI.
4. El navbar muestra la bandeja y `sonner` dispara toasts.
5. En detalle de ticket se agregan listeners por ticket para comentarios.

### Topics actuales
- `/topic/tickets/nuevo`
- `/topic/tickets/actualizacion`
- `/topic/tickets/cerrado`
- `/user/queue/asignacion`
- `/user/queue/comentarios`
- `/topic/tickets/{id}/comentarios`

## Consideraciones de seguridad
- se envian headers STOMP con token
- tambien se agrega token en la URL SockJS
- esto ya esta documentado como riesgo o mejora en [SEGURIDAD-FRONTEND.md](../seguridad/SEGURIDAD-FRONTEND.md)

## Variables de entorno relacionadas
- `VITE_API_URL`
- `VITE_WS_URL`

## Cuando revisar este documento
- si cambia el backend
- si cambia la forma de autenticacion
- si cambian topics o eventos websocket
- si una vista deja de recibir datos con la forma esperada
