# 🛍️ Adhe.E-commerce — Proyecto Entrega Final

Aplicación educativa tipo e-commerce construida con React + TypeScript + Vite. Este proyecto integra **autenticación Firebase**, **Firestore como backend**, panel de administración con roles, carrito persistente por usuario, catálogo paginado, sistema de cupones, y gestión completa de productos.

> **Adhe** es parte del usuario que utilizo para mis proyectos personales (`Adhe-Enne`), puedes encontrar más en [github.com/Adhe-Enne](https://github.com/Adhe-Enne).

**Resumen rápido**

- **Tipo:** SPA (Vite + React + TypeScript)
- **Stack:** React 19, TypeScript 6, Vite 8, Tailwind CSS v4 + principios **Tailwind UI**, Firebase 12.14 (Auth + Firestore)
- **Autenticación:** Firebase Auth con roles `user` y `admin`
- **Backend:** Firebase Firestore (productos, categorías, etiquetas, cupones, órdenes, miembros del equipo)
- **Propósito:** E-commerce educativo con login, registro, roles, carrito, checkout, historial de órdenes, panel admin (CRUD productos, cupones, dashboard)

**🔗 Demo en vivo**

El proyecto está publicado en **Netlify**: [talento-tech-react.netlify.app](https://talento-tech-react.netlify.app/)

**Arranque rápido**

Requisitos: Node.js ≥18 (recomendado ≥22) y npm.

```bash
# instalar dependencias
npm install

# arrancar modo desarrollo (Vite)
npm run dev

# build de producción (incluye typecheck)
npm run build

# correr eslint
npm run lint

# preview del build
npm run preview
```

**Variables de entorno requeridas**

Copiar `.env.development` con las siguientes claves de Firebase:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

Si falta alguna, la app lanza un error claro al iniciar.

---

## 🔐 Autenticación y roles

El sistema usa **Firebase Auth** con dos roles:

| Rol | Acceso |
|-----|--------|
| `user` | Navegar, comprar, historial de órdenes, perfil |
| `admin` | Todo lo anterior + `/admin/*` (dashboard, productos, cupones, pedidos) |

El componente `AuthGuard` envuelve las rutas y redirige según el estado (`guest`/`protected`) y el rol del usuario.

---

## 🏠 Pantallas principales

**🏠 Home / Catálogo**
- Lista de productos paginada desde Firestore
- Búsqueda por texto (`?q=...`) y filtro de favoritos (`?filter=favorites`)
- Carga infinita (paginación con `startAfter`)

**🔎 Detalle de producto**
- Ruta `/producto/:id` con imagen, descripción, precio y control de cantidad

**🧺 Carrito**
- Persiste en `localStorage` con key por usuario (`tt_cart_{uid}`)
- Aumentar/disminuir cantidad, eliminar items, ver total
- Soporte para **cupones de descuento** (porcentaje, monto fijo)

**💳 Checkout**
- Formulario de envío con validación
- Resumen de orden y total con descuento aplicado
- Confirmación y almacenamiento en Firestore (`orders_purchases`)

**📦 Órdenes**
- `/mis-ordenes` — historial de compras del usuario
- `/orden/:id` — detalle y confirmación de una orden

**💙 Favoritos**
- Marcar/desmarcar desde la tarjeta (♥)
- Persisten en `localStorage` con clave `tt_favorites`
- Filtro especial en Home: `?filter=favorites`

**✉️ Contacto**
- Formulario de contacto simulado + directorio del equipo desde Firestore

**👤 Perfil**
- `/perfil` — datos del usuario autenticado

**👥 Equipo**
- `/equipo` — vista completa del equipo desde Firestore (`team_members`)

**🔔 Notificaciones**
- Sistema integrado vía `react-toastify` con variantes: `success`, `info`, `warning`, `error`

---

## 🛠️ Panel de Administración

Todas las rutas bajo `/admin/*` requieren rol `admin`.

| Ruta | Función |
|------|---------|
| `/admin` | Dashboard con métricas (ventas, órdenes, productos) |
| `/admin/productos` | Listado y gestión de productos |
| `/admin/productos/nuevo` | Crear producto (con categoría, etiquetas, imágenes) |
| `/admin/productos/:id/editar` | Editar producto existente |
| `/admin/cupones` | CRUD de cupones (activar/desactivar) |
| `/admin/ordenes` | Listado de pedidos de todos los usuarios |

---

## 🧱 Arquitectura

### Providers (9 contextos)

```
AuthProvider → CartProvider → NotificationProvider → FavoritesProvider → CategoriesProvider → TagsProvider → ProductsProvider → TeamProvider → CouponsProvider
```

Cada provider expone hooks selectores en `src/hooks/selectors/` (ej. `useAuth`, `useCart`, `useFavorites`).

### Lazy loading

Todas las rutas secundarias (admin, auth, checkout, órdenes, detalle, equipo) usan `React.lazy()` + `<Suspense>` para carga diferida.

### Servicios Firebase (9)

En `src/services/`: `authService`, `categoryService`, `couponService`, `exchangeRateService`, `imageService`, `orderService`, `productService`, `tagService`, `teamService`.

### Estilos

- **Tailwind CSS v4** con configuración `@theme` en `src/index.css` (colores semánticos, tipografía, spacing)
- Principios **Tailwind UI**: utility-first, diseño responsive sin media queries, componentes self-contained
- `react-datepicker` y `react-toastify` con estilos importados
- Sin Bootstrap ni react-bootstrap

---

## 🗺️ Rutas principales

| Ruta | Componente | Acceso |
|------|-----------|--------|
| `/login` | Login | Invitados |
| `/registro` | Register | Invitados |
| `/` | Home (catálogo) | Usuarios |
| `/productos` | Home (catálogo) | Usuarios |
| `/producto/:id` | Detalle producto | Usuarios |
| `/carrito` | Cart | Usuarios |
| `/checkout` | Checkout | Usuarios |
| `/orden/:id` | Confirmación orden | Usuarios |
| `/mis-ordenes` | Historial órdenes | Usuarios |
| `/perfil` | Perfil usuario | Usuarios |
| `/equipo` | Vista equipo | Usuarios |
| `/contacto` | Contacto | Usuarios |
| `/admin` | Dashboard admin | Admin |
| `/admin/productos` | Lista productos | Admin |
| `/admin/productos/nuevo` | Crear producto | Admin |
| `/admin/productos/:id/editar` | Editar producto | Admin |
| `/admin/cupones` | Cupones | Admin |
| `/admin/ordenes` | Órdenes | Admin |

---

## 📁 Estructura general de carpetas

```
ProyectoEntregaFinal/
├─ package.json                (dependencias y scripts npm)
├─ vite.config.ts              (Vite + React + Tailwind plugins)
├─ eslint.config.js            (ESLint con 10+ plugins)
├─ tsconfig.json               (referencia a app + node)
├─ tsconfig.app.json           (strict: true, noUnusedLocals, etc.)
├─ tsconfig.node.json          (config TS para tooling node)
├─ .prettierrc                 (printWidth: 220, endOfLine: lf)
├─ .env.development            (variables Firebase — no commiteado)
├─ .gitignore
├─ index.html                  (HTML base)
├─ public/
│  ├─ productos.json           (datos iniciales de productos)
│  ├─ images/                  (imágenes de productos y assets)
│  └─ data/
│     └─ nosotros.json         (datos del equipo)
├─ src/
│  ├─ main.tsx                 (entrypoint: React + HelmetProvider + ToastContainer)
│  ├─ App.tsx                  (BrowserRouter + AppRoutes)
│  ├─ App.Constants.ts         (nombres de colecciones Firestore)
│  ├─ firebase.ts              (config Firebase Auth + Firestore)
│  ├─ index.css                (Tailwind v4 @theme + estilos globales)
│  ├─ components/
│  │  ├─ AppProviders.tsx      (nesting de los 9 providers)
│  │  ├─ AppRoutes.tsx         (definición de todas las rutas)
│  │  ├─ admin/                (AdminLayout, AdminDashboard, CRUD, cupones, órdenes)
│  │  ├─ auth/                 (AuthGuard, Login, Register, Profile, AuthLayout)
│  │  ├─ cart/                 (carrito)
│  │  ├─ checkout/             (formulario envío, resumen orden)
│  │  ├─ common/               (ExchangeRatesBanner, etc.)
│  │  ├─ contact/              (formulario contacto + directorio)
│  │  ├─ home/                 (Home + HomeView + paginación)
│  │  ├─ layout/               (Layout principal, navbar, header)
│  │  ├─ orders/               (OrderConfirmation, OrderHistory)
│  │  ├─ product/              (tarjetas, detalle, formularios)
│  │  ├─ team/                 (TeamList, vista completa)
│  │  └─ ui/                   (HelmetMeta, LoadingSpinner, etc.)
│  ├─ contexts/                (Auth, Cart, Categories, Coupons, Favorites, Notification, Products, Tags, Team)
│  ├─ hooks/                   (useAsyncCollection, useCartActions, useOrders, etc.)
│  │  └─ selectors/            (useAuth, useCart, useFavorites, etc.)
│  ├─ models/                  (Product, CartItem, Order, Coupon, Category, Tag, User, etc.)
│  ├─ services/                (9 servicios Firebase: auth, products, orders, coupons, etc.)
│  ├─ types/                   (auth, shared, ExchangeRateTypes, PaginatedResult, etc.)
│  └─ utils/                   (storage, errorUtils, firestore helpers, parseDataUtils)
└─ README.md                   (este archivo)
```

---

## 🧰 Tecnologías

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| **Lenguaje** | TypeScript | ^6.0.2 |
| **Framework** | React | ^19.2.5 |
| **Build** | Vite | ^8.0.8 |
| **UI** | Tailwind CSS v4 + principios Tailwind UI | ^4.3.2 |
| **Backend** | Firebase (Auth + Firestore) | ^12.14.0 |
| **Ruteo** | React Router | ^7.14.0 |
| **Íconos** | react-icons | ^5.6.0 |
| **Notificaciones** | react-toastify | ^11.1.0 |
| **SEO** | react-helmet-async | ^3.0.0 |
| **Date picker** | react-datepicker | ^9.1.0 |
| **Estado** | use-context-selector | ^2.0.0 |
| **Linting** | ESLint 9 + 10+ plugins | ^9.39.4 |
| **Formateo** | Prettier | — |

---

## ⚙️ Convenciones del proyecto

- **ESLint estricto**: `@typescript-eslint/explicit-function-return-type: "error"` — toda función requiere tipo de retorno explícito
- **Destructuring**: prohibido en firmas de función (se hace dentro del cuerpo)
- **Orden**: imports, interfaces, props JSX, miembros de clase — todo ordenado alfabéticamente por `perfectionist`
- **Variables no usadas**: error (`noUnusedLocals`, `noUnusedParameters`)
- **No hay tests** — el proyecto no incluye framework de testing
- **AGENTS.md** local en la raíz del proyecto (ignorado por git)

---

## 🔍 Archivos clave

| Archivo | Propósito |
|---------|-----------|
| `src/components/AppRoutes.tsx` | Definición de todas las rutas con lazy loading |
| `src/components/AppProviders.tsx` | Nesting de los 9 context providers |
| `src/firebase.ts` | Inicialización Firebase (valida env vars al inicio) |
| `src/contexts/Auth/AuthProvider.tsx` | Estado de autenticación + Firebase Auth |
| `src/components/auth/guards/AuthGuard.tsx` | Guard de rutas (guest/protected + roles) |
| `src/App.Constants.ts` | Nombres de colecciones Firestore |
| `eslint.config.js` | 182 líneas de configuración ESLint |
| `tsconfig.app.json` | TypeScript strict config para la app |
| `public/productos.json` | Datos de ejemplo para precarga inicial |
