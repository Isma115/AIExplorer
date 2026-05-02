# AIExplorer

Proyecto base con `React` en el frontend y una estructura de `Node.js` reservada en el backend para futura integracion de ORM y base de datos, siguiendo la estructura definida en `Agent.md`.

## Estructura

```text
AIExplorer/
├── Agent.md
├── README.md
├── package.json
├── backend/
│   ├── package.json
│   ├── README.md
│   ├── controllers/
│   ├── models/
│   └── routes/
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── main.jsx
    ├── app/
    │   └── App.jsx
    ├── pages/
    │   └── home/
    │       ├── HomePage.jsx
    │       ├── components/
    │       │   ├── ChatComposer.jsx
    │       │   ├── ChatHeader.jsx
    │       │   └── ChatHistory.jsx
    │       ├── logic/
    │       │   └── home.js
    │       └── styles/
    │           └── home.css
    └── shared/
        └── styles/
            └── global.css
```

## Ejecucion

1. Ejecuta `npm install` en la raiz.
2. Ejecuta `npm run dev` en la raiz.
3. Abre la URL que indique Vite, normalmente `http://localhost:5173`.

El comando `npm run dev` levanta:

- `frontend` en `http://localhost:5173`
- `backend` en `http://localhost:3001`

## Estado actual

- `frontend`: interfaz de chat hecha con React, separada por pagina, componentes, logica y estilos. Toda la logica funcional actual del chat vive aqui.
- `backend`: servidor Node ligero para recursos locales de modelos, con catalogo GGUF y descargas a `backend/models/local`, manteniendo la puerta abierta a futura capa ORM.
