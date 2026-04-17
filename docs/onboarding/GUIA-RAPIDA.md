# Guia Rapida

## Para que sirve este proyecto
IT Support Frontend es la interfaz del sistema de soporte interno para registrar, atender y dar seguimiento a tickets.

La app esta pensada para tres perfiles:
- `admin`: administra catalogos y supervisa el sistema
- `tecnico`: atiende tickets asignados y toma tickets disponibles
- `encargado`: crea tickets y da seguimiento a los suyos

## Por donde empezar
Si es tu primer contacto con el proyecto, este orden funciona bien:

1. Lee [MAPA-DEL-PROYECTO.md](./MAPA-DEL-PROYECTO.md).
2. Revisa [MODULOS-Y-RESPONSABILIDADES.md](../producto/MODULOS-Y-RESPONSABILIDADES.md).
3. Consulta [ARQUITECTURA-FRONTEND.md](../arquitectura/ARQUITECTURA-FRONTEND.md).
4. Usa [FRONT-FLUJO-Y-VALIDACIONES.md](../flujos/FRONT-FLUJO-Y-VALIDACIONES.md) cuando necesites detalle operativo.
5. Usa [SEGURIDAD-FRONTEND.md](../seguridad/SEGURIDAD-FRONTEND.md) para cambios sensibles.

## Arranque local
```bash
npm install
npm run dev
```

La app corre normalmente en `http://localhost:5173`.

## Configuracion minima
Crear `.env` con:

```env
VITE_API_URL=http://localhost:3000/api
```

Opcional:

```env
VITE_WS_URL=http://localhost:3000/api/ws
```

## Que partes son mas importantes
- `src/routes/`: define acceso por ruta y rol
- `src/context/`: sesion y tiempo real
- `src/services/`: integracion con backend
- `src/pages/`: comportamiento por vista
- `src/components/`: piezas reutilizables
- `src/utils/`: seguridad, formato, mapeo y metricas

## Decisiones clave que conviene saber desde el inicio
- Los IDs visibles en URLs de detalle se ofuscan en frontend.
- La app comparte un shell visual con `AppLayout`.
- Los roles cambian tanto el menu como los datos visibles.
- Los servicios normalizan payloads del backend antes de entregarlos a las vistas.
- Los comentarios y varias notificaciones llegan por WebSocket.
- Formularios de datos críticos (usuarios, áreas, sucursales) requieren confirmación explícita antes de guardar o descartar cambios.

## Documentos de referencia rapida
- rutas y permisos: [ROLES-PERMISSIONS.md](../roles/ROLES-PERMISSIONS.md)
- endpoints: [ENDPOINTS.md](../endpoints/ENDPOINTS.md)
- estilos visuales: [colors.md](../estilos/colors.md)
- layout visual: [layout-pages.md](../estilos/layout-pages.md)
