# Mapa Del Proyecto

## Vision general
El proyecto esta organizado alrededor de cuatro capas:
- navegacion y acceso
- vistas y componentes
- integracion con backend
- utilidades y reglas transversales

## Estructura principal
```text
src/
  assets/        recursos estaticos
  components/    piezas reutilizables
  constants/     roles, estados y prioridades
  context/       sesion y websocket
  hooks/         acceso a contextos
  pages/         vistas de negocio
  routes/        router y proteccion por rol
  services/      axios y consumo backend
  styles/        CSS puntual
  utils/         mapeo, seguridad, formato y metricas
```

## Como fluye una funcionalidad tipica
1. El usuario navega a una ruta definida en `AppRouter`.
2. `ProtectedRoute` valida sesion y roles permitidos.
3. La pagina carga datos via `services/`.
4. Los servicios llaman al backend con `api.js`.
5. Los mappers normalizan la respuesta.
6. La pagina renderiza con componentes reutilizables.
7. Si hay eventos en tiempo real, `WebSocketContext` actualiza la UI.

## Piezas base que mas aparecen
- `AppLayout`: shell general de la app
- `Navbar`: navegacion superior y notificaciones
- `Sidebar`: opciones segun rol
- `FilterBar`: filtros reutilizables
- `Badge`: estados y prioridades
- `Table`: tablas administrativas
- `LoadingState`: estados de carga

## Modulos funcionales
- autenticacion
- dashboard
- estadisticas
- tickets
- usuarios
- areas
- sucursales
- perfil

## Donde buscar segun lo que quieras cambiar
### Si vas a tocar permisos o accesos
- [AppRouter.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/routes/AppRouter.jsx)
- [ProtectedRoute.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/routes/ProtectedRoute.jsx)
- [ROLES-PERMISSIONS.md](../roles/ROLES-PERMISSIONS.md)

### Si vas a tocar login o sesion
- [AuthContext.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/context/AuthContext.jsx)
- [api.js](/c:/Users/yasbe/Downloads/ITSupport/src/services/api.js)
- [LoginPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/auth/LoginPage.jsx)

### Si vas a tocar tickets
- [TicketsPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/TicketsPage.jsx)
- [TicketDetailPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/TicketDetailPage.jsx)
- [ticketService.js](/c:/Users/yasbe/Downloads/ITSupport/src/services/ticketService.js)

### Si vas a tocar tiempo real
- [WebSocketContext.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/context/WebSocketContext.jsx)
- [websocketService.js](/c:/Users/yasbe/Downloads/ITSupport/src/services/websocketService.js)

### Si vas a tocar UI base
- [src/components/ui](/c:/Users/yasbe/Downloads/ITSupport/src/components/ui)
- [colors.md](../estilos/colors.md)
- [layout-pages.md](../estilos/layout-pages.md)

## Riesgos de contexto que suelen perderse
- `admin` puede ver tickets, pero no opera el flujo de comentarios o cierre como un tecnico.
- `tecnico` y `encargado` comparten modulo de tickets, pero cada uno ve una experiencia distinta.
- No todos los datos del backend llegan ya listos para UI; hay normalizacion intermedia.
- Las rutas de detalle esperan IDs ofuscados, no siempre IDs crudos.
