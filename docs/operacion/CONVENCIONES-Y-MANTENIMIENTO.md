# Convenciones Y Mantenimiento

## Objetivo
Dejar reglas practicas para que el proyecto siga siendo mantenible conforme crece.

**Última actualización**: 2026-04-17
- ✨ Nuevo: Confirmación ultra-segura en formularios (UsuarioForm, AreaForm, SucursalForm)
- ✨ Nuevo: Botón "Cancelar" ahora disponible en AREAForm y SucursalForm

## Convenciones de codigo
- usa constantes para roles, estados y prioridades
- usa `services/` para toda llamada remota
- usa `utils/apiMappers.js` cuando el backend cambie nombres o estructuras
- usa `feedback.js` para mantener mensajes consistentes
- usa `security.js` para validar y sanitizar entradas de texto
- formularios que modifiquen datos criticos (usuarios, áreas, sucursales) deben usar confirmación ultra-segura con Modal

## Convenciones de UI
- reutiliza componentes de `src/components/ui`
- conserva badges para estado y prioridad
- evita introducir estilos aislados si el patron ya existe
- si una pagina usa una variante visual nueva, documentala en `docs/estilos/`

## Convenciones de navegacion
- no enlazar detalles con ID crudo si la ruta espera ID ofuscado
- revisar `cryptoUtils.js` antes de crear nuevas rutas de detalle
- mantener `Sidebar` alineado con `AppRouter` cuando aparezcan nuevas vistas

## Convenciones de documentacion
- `docs/` es la fuente de verdad
- si una decision afecta arquitectura, seguridad o flujo, documentarla
- preferir varios archivos pequenos enlazados entre si
- evitar notas temporales largas en raiz del repo

## Checklist antes de cerrar un cambio
- la ruta esta protegida correctamente
- el rol correcto ve la accion correcta
- la vista usa servicios y no llamadas HTTP directas
- el feedback visible es claro
- la documentacion afectada fue actualizada
- si es un formulario que modifica datos criticos, tiene confirmación ultra-segura (Modal)

## Lugares que suelen necesitar sincronizacion
- `AppRouter.jsx` y `Sidebar.jsx`
- `ticketService.js` y `ENDPOINTS.md`
- `security.js` y `SEGURIDAD-FRONTEND.md`
- cambios visuales y `docs/estilos/`
- cambios de flujo y `FRONT-FLUJO-Y-VALIDACIONES.md`

## Deuda tecnica visible hoy
- `TicketContext` tiene bajo protagonismo real
- `TicketsPage.jsx` concentra bastante logica
- la autenticacion del socket todavia merece endurecimiento

Estas no son urgencias obligatorias, pero si puntos a vigilar en siguientes iteraciones.
