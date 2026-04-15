# IT Support Frontend

Frontend del sistema de soporte IT para gestion de tickets, seguimiento por rol y actualizacion en tiempo real.

## Stack
- React 18
- Vite
- React Router DOM
- TailwindCSS
- Axios
- SockJS + STOMP
- Sonner

## Scripts
```bash
npm install
npm run dev
npm run build
npm run preview
```

## Variables de entorno
Copia `.env.example` a `.env` y configura como minimo:

```env
VITE_API_URL=http://localhost:3000/api
```

Opcionalmente puedes definir:

```env
VITE_WS_URL=http://localhost:3000/api/ws
```

## Documentacion
La documentacion principal vive en [docs/README.md](./docs/README.md).

Puntos de entrada recomendados:
- onboarding rapido: [docs/onboarding/GUIA-RAPIDA.md](./docs/onboarding/GUIA-RAPIDA.md)
- mapa del proyecto: [docs/onboarding/MAPA-DEL-PROYECTO.md](./docs/onboarding/MAPA-DEL-PROYECTO.md)
- modulos y roles: [docs/producto/MODULOS-Y-RESPONSABILIDADES.md](./docs/producto/MODULOS-Y-RESPONSABILIDADES.md)

## Estado actual
- autenticacion con token Bearer en `sessionStorage`
- rutas protegidas por rol
- detalle de ticket con comentarios en tiempo real
- dashboard y estadisticas con vistas acotadas por rol
- CRUD administrativo para usuarios, areas y sucursales
