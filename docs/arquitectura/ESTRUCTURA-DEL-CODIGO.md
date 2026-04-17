# Estructura Del Codigo

## Objetivo
Explicar donde vive cada responsabilidad tecnica para que el codigo siga creciendo de forma ordenada.

**Última actualización**: 2026-04-17
- ✨ Nuevo: Componentes de formulario usan Modal para confirmación de guardado y descarte
- ✨ Nuevo: Estados `showCancelModal` y `showSaveModal` en formularios

## Capas del frontend
### `routes/`
Define la superficie navegable de la app y protege acceso por rol.

Responsables:
- `AppRouter.jsx`
- `ProtectedRoute.jsx`

### `context/`
Contiene estado transversal de sesion y tiempo real.

Responsables:
- `AuthContext.jsx`
- `WebSocketContext.jsx`
- `TicketContext.jsx`

Nota:
`TicketContext` existe, pero hoy tiene menos peso que los servicios y el estado local de pagina.

### `services/`
Es la capa de integracion con backend.

Responsabilidades:
- construir requests
- centralizar autenticacion HTTP
- extraer payloads utiles
- mapear respuestas al formato esperado por UI

### `pages/`
Modela comportamiento por vista.

Aqui vive:
- composicion de componentes
- carga de datos por pagina
- reglas UI especificas del flujo
- acciones visibles para el usuario

### `components/`
Piezas reutilizables.

Subgrupos actuales:
- `ui/`: primitives y wrappers de interfaz
  - `Button`, `Input`, `FormField`, `Badge`, `Table`, `Select`, `FilterBar`, `Modal`
  - **`Modal`** es utilizado por formularios para confirmación ultra-segura de guardado y descarte
- `layout/`: shell visual
- `tickets/`, `usuarios/`, `areas/`, `sucursales/`: componentes por dominio
  - Formularios (`*Form.jsx`) ahora usan Modal para:
    - Confirmación antes de guardar cambios
    - Confirmación antes de descartar cambios

### `utils/`
Reglas transversales y helpers.

Responsabilidades actuales:
- sanitizacion
- mapeo de payloads
- formato de fechas
- mensajes de feedback
- metricas
- ofuscacion de IDs

## Patron de datos
El flujo dominante hoy es:

1. pagina o componente dispara una accion
2. `service` llama al backend
3. `apiMappers` normaliza
4. la vista consume objetos ya mas estables

Esto reduce acoplamiento entre la forma del backend y la UI.

## Patron de acceso
El acceso no depende solo de ocultar botones:
- el router restringe rutas
- la UI ajusta menu y acciones
- el backend sigue siendo la autoridad real

## Patron visual
La app mantiene una identidad visual bastante consistente:
- fondo oscuro con capas y orbes
- cards glass
- badges para estados y prioridad
- componentes propios para select, filtros y tablas

Mas detalle en [layout-pages.md](../estilos/layout-pages.md) y [colors.md](../estilos/colors.md).

## Convenciones que ya se usan
- roles centralizados en `src/constants/roles.js`
- estados en `src/constants/ticketStatus.js`
- prioridades en `src/constants/ticketPrioridad.js`
- token HTTP centralizado en `src/services/api.js`
- feedback reusable en `src/utils/feedback.js`

## Cuidados importantes al extender el proyecto
- evita meter llamadas `axios` directamente en paginas
- evita duplicar reglas de roles en muchos archivos
- evita usar strings de estado o rol si ya existe una constante
- evita mezclar payload crudo del backend con render sin normalizar
- conserva una sola fuente de verdad documental en `docs/`
