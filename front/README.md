# ALMĀS — Frontend

Tienda en línea de joyería artesanal. Construido con **React + Vite**, **Zustand** para
la máquina de estados del flujo de compra, y **GraphQL** (fetch nativo) para consumir
el backend.

## Requisitos

- Node.js 18+
- El backend corriendo en `http://127.0.0.1:8000` (ver README de `back/`)

## Instalación

```bash
cd front
npm install
```

## Correr en desarrollo

```bash
npm run dev
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`).

> **Importante:** el backend debe estar corriendo en paralelo (`uvicorn main:app --reload`
> dentro de `back/`) para que el catálogo, el detalle de producto y el checkout carguen
> datos reales.

## Flujo de la aplicación

Home → Detalle de categoría → Detalle de producto → Carrito → Checkout

La navegación se controla con una **máquina de estados** (sin rutas/URLs), implementada
en `src/store/useAppStore.js` con Zustand. `App.jsx` decide qué pantalla mostrar según
el valor de `screen` en el store.

## Estructura del proyecto

```
front/src/
├── App.jsx                  # máquina de estados (switch de pantallas)
├── main.jsx
├── index.css                 # paleta de colores y estilos base
├── store/useAppStore.js      # Zustand: navegación + carrito
├── context/SearchContext.jsx # búsqueda global (Context API)
├── graphql/client.js         # helper de fetch hacia el backend GraphQL
└── components/
    ├── Home.jsx, CategoryDetail.jsx, ProductDetail.jsx, Cart.jsx, Checkout.jsx
    ├── ProductCard.jsx, Skeleton.jsx
    └── layout/ (TopBar, Sidebar, Hero, Footer)
```

Ver `reporte-p2.md` (carpeta de reportes) para el diagrama de componentes y el diagrama
de transición de estados completo.