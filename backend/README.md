# Backend

La carpeta `backend` mantiene la estructura preparada para futura integracion de base de datos y ORM en `Node.js`, pero ahora tambien expone un servidor local para la gestion de recursos de modelos.

## Responsabilidades actuales

- Servir `GET /api/models` para devolver el catalogo de modelos locales GGUF.
- Servir `POST /api/models/download` para iniciar descargas en `backend/models/local`.
- Mantener el frontend sin logica de interfaz dentro del backend.

## Arranque

1. Desde la raiz ejecuta `npm run dev` para levantar frontend y backend.
2. Si solo quieres el backend, ejecuta `npm run start:backend`.
