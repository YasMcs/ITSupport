# Modulos Y Responsabilidades

## Objetivo
Describir que hace cada modulo, quien lo usa y donde vive su logica principal.

## Roles del sistema
- `admin`: administracion, supervision y catalogos
- `tecnico`: atencion operativa de tickets
- `encargado`: registro y seguimiento de tickets propios

Mas detalle en [ROLES-PERMISSIONS.md](../roles/ROLES-PERMISSIONS.md).

## Autenticacion
### Que resuelve
- login
- persistencia corta de sesion
- logout
- manejo de sesion expirada

### Archivos principales
- [LoginPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/auth/LoginPage.jsx)
- [AuthContext.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/context/AuthContext.jsx)
- [authService.js](/c:/Users/yasbe/Downloads/ITSupport/src/services/authService.js)
- [api.js](/c:/Users/yasbe/Downloads/ITSupport/src/services/api.js)

## Dashboard
### Que muestra
- resumen de tickets segun rol
- tickets recientes
- tickets criticos

### Archivos principales
- [DashboardPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/DashboardPage.jsx)
- [ticketService.js](/c:/Users/yasbe/Downloads/ITSupport/src/services/ticketService.js)

## Estadisticas
### Que muestra
- KPIs de tickets
- distribucion por prioridad
- areas con mas incidencias
- tickets estancados

### Archivos principales
- [EstadisticasPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/EstadisticasPage.jsx)
- [metrics.js](/c:/Users/yasbe/Downloads/ITSupport/src/utils/metrics.js)

## Tickets
### Que resuelve
- listado por rol
- tickets disponibles para tecnico
- creacion de ticket por encargado
- detalle por rol
- comentarios
- cierre de ticket

### Experiencias por rol
#### Admin
- ve una tabla global
- entra al detalle para consulta

#### Tecnico
- ve sus tickets asignados en cards
- puede tomar tickets disponibles
- puede comentar y cerrar sus tickets

#### Encargado
- ve sus tickets en cards
- puede crear tickets
- puede comentar sus propios tickets mientras sigan abiertos

### Archivos principales
- [TicketsPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/TicketsPage.jsx)
- [TicketDetailPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/TicketDetailPage.jsx)
- [NuevoTicketPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/NuevoTicketPage.jsx)
- [TicketTable.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/components/tickets/TicketTable.jsx)
- [TicketForm.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/components/tickets/TicketForm.jsx)

## Usuarios
### Que resuelve
- listado
- alta
- edicion
- suspension y activacion
- detalle en solo lectura

### Uso
- solo `admin`

### Archivos principales
- [UsuariosPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/UsuariosPage.jsx)
- [UsuarioDetallePage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/UsuarioDetallePage.jsx)
- [EditarUsuarioPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/EditarUsuarioPage.jsx)
- [NuevoUsuarioPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/NuevoUsuarioPage.jsx)

## Areas
### Que resuelve
- listado
- alta
- edicion
- suspension y activacion
- detalle

### Uso
- solo `admin`

### Archivos principales
- [AreasPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/AreasPage.jsx)
- [AreaDetallePage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/AreaDetallePage.jsx)
- [NuevaAreaPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/NuevaAreaPage.jsx)

## Sucursales
### Que resuelve
- listado
- alta
- edicion
- suspension y activacion
- detalle

### Uso
- solo `admin`

### Archivos principales
- [SucursalesPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/SucursalesPage.jsx)
- [SucursalDetallePage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/SucursalDetallePage.jsx)
- [NuevaSucursalPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/NuevaSucursalPage.jsx)

## Perfil
### Que resuelve
- visualizacion y edicion de datos propios

### Archivos principales
- [PerfilPage.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/pages/PerfilPage.jsx)

## Tiempo real
### Que resuelve
- notificaciones
- actualizacion de comentarios
- eventos de tickets nuevos, asignados, actualizados y cerrados

### Archivos principales
- [WebSocketContext.jsx](/c:/Users/yasbe/Downloads/ITSupport/src/context/WebSocketContext.jsx)
- [websocketService.js](/c:/Users/yasbe/Downloads/ITSupport/src/services/websocketService.js)

## Soporte transversal
### Utilidades importantes
- [security.js](/c:/Users/yasbe/Downloads/ITSupport/src/utils/security.js)
- [feedback.js](/c:/Users/yasbe/Downloads/ITSupport/src/utils/feedback.js)
- [apiMappers.js](/c:/Users/yasbe/Downloads/ITSupport/src/utils/apiMappers.js)
- [cryptoUtils.js](/c:/Users/yasbe/Downloads/ITSupport/src/utils/cryptoUtils.js)
- [userDisplay.js](/c:/Users/yasbe/Downloads/ITSupport/src/utils/userDisplay.js)
