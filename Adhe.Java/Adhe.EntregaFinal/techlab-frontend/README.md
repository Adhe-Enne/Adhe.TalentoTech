# 🌐 TechLab Frontend — Documentación Visual

> ⚠️ **Advertencia:** Este frontend tiene limitaciones significativas y probablemente no funcione correctamente en su estado actual. Fue desarrollado como un esfuerzo didáctico para complementar el backend de TechLab, pero no está completamente integrado ni terminado. Su propósito principal es ilustrar un intento de desarrollo frontend.

Este repositorio contiene un **frontend en React (TypeScript)** creado como complemento para el backend de TechLab. Es una implementación parcial y didáctica que incluye registro, inicio de sesión y una grilla de productos consumida desde el API.

---

## 🚀 Resumen rápido

- **Estado:** Implementación mínima funcional (login, registro, visualización de productos).
- **Base URL del API:** `http://localhost:8080` (configurado en `src/api/axios.ts`).
- **Token:** Se guarda en `localStorage` con clave `authToken` y se añade como `Authorization: Bearer <token>` en cada petición.

---

## ✨ Funcionalidades implementadas

### 🔑 Autenticación

- **Registro de usuario:**
  - Formulario en `src/pages/RegisterPage.tsx`.
  - Llama a `POST /api/auth/register`.
- **Inicio de sesión:**
  - Formulario en `src/pages/LoginPage.tsx`.
  - Llama a `POST /api/auth/login`.
  - Guarda el token en `localStorage` y Redux.

### 🛍️ Productos

- **Grilla de productos:**
  - Componente: `src/features/products/ProductGrid.tsx`.
  - Carga productos desde `GET /api/productos`.
  - Muestra productos con `src/components/specific/ProductCard.tsx`.

### 🛒 Carrito (básico)

- **Agregar productos al carrito:**
  - Acción `addToCart` en el slice `cart`.
  - El carrito se gestiona en memoria (Redux).

---

## 🛠️ Detalles técnicos

- **Normalización de respuestas:**
  - `getProducts` maneja varias formas de respuesta (`data.content`, `data.data`, array directo).
- **Autenticación:**
  - `authSlice` usa `createAsyncThunk` y guarda el token en `localStorage`.
  - Interceptor de Axios añade automáticamente la cabecera `Authorization`.
- **Rutas protegidas:**
  - `src/components/PrivateRoute.tsx` protege páginas como `Dashboard` y `StockManagement`.
- **Scripts de desarrollo:**
  - `npm run dev` para desarrollo (Vite).
  - `npm run build` para producción.

---

## 📂 Estructura mínima del proyecto

```
techlab-frontend/
├─ package.json
├─ src/
│  ├─ api/                # axios, authApi, productApi
│  ├─ app/                # store (Redux)
│  ├─ features/
│  │   ├─ auth/
│  │   ├─ products/
│  │   └─ cart/
│  ├─ components/         # PrivateRoute, ProductCard, etc.
│  ├─ pages/              # AuthPage, ProductPage, Dashboard...
```

---

## 🌐 Endpoints consumidos

- **Autenticación:**
  - `POST /api/auth/login` → Devuelve token.
  - `POST /api/auth/register` → Devuelve objeto usuario.
- **Productos:**
  - `GET /api/productos` → Listado de productos.
  - `PUT /api/productos/{id}` → Actualización parcial de producto.

> **Nota:** El frontend asume ciertas estructuras de respuesta (`data.data`, `content`). Ajustes pueden ser necesarios si el backend cambia.

---

## 🖥️ Cómo ejecutar localmente

1. Abrir PowerShell en la carpeta `techlab-frontend`:

```powershell
cd 'c:\Workspace\Adhe.CursoJava\Adhe.EntregaFinal\techlab-frontend'
```

2. Instalar dependencias:

```powershell
npm install
```

3. Levantar el servidor de desarrollo:

```powershell
npm run dev
```

4. Abrir en el navegador: [http://localhost:5173](http://localhost:5173).

> **Importante:** Modificar `baseURL` en `src/api/axios.ts` si el backend corre en otra URL.

---

## ⚠️ Limitaciones actuales y posibles problemas

### ❗ Estado del proyecto

- **Implementación incompleta:** Muchas páginas están incompletas o son solo bosquejos (`StockManagementPage`, `DashboardPage`).
- **Falta de integración completa:** Algunos flujos, como la confirmación de pedidos desde el carrito, no están conectados al backend.
- **Carrito local:** El carrito se gestiona únicamente en memoria (Redux) y no envía datos al backend.

### ❗ Problemas esperados

- **Incompatibilidad con el backend:**
  - El frontend asume estructuras específicas de respuesta (`data.data`, `content`). Si el backend devuelve un formato diferente, las funcionalidades pueden fallar.
  - Endpoints como `GET /api/productos` podrían requerir ajustes si la API cambia.
- **Errores no manejados:**
  - No hay manejo centralizado de errores. Si una petición falla, el usuario podría no recibir retroalimentación adecuada.
- **Dependencia de `localStorage`:**
  - Si el token no se guarda correctamente o expira, las peticiones protegidas fallarán sin un mecanismo de renovación.

### ❗ Requisitos adicionales

- **Backend en ejecución:** El frontend depende de un backend funcional en `http://localhost:8080`. Si el backend no está disponible, la aplicación no funcionará.
- **Configuración manual:** Es posible que debas ajustar `src/api/axios.ts` para que coincida con la URL del backend.

---

## 🔮 Próximos pasos recomendados

- Verificar con el equipo/backend el formato exacto de las respuestas de `GET /api/productos` y `POST /api/auth/login`.
- Implementar manejo de errores centralizado y mostrar mensajes claros al usuario.
- Completar endpoints para pedidos y sincronizar el carrito con el backend.
- Añadir pruebas unitarias para los slices (`auth`, `products`) y pruebas e2e básicas.
- Mejorar la documentación para incluir ejemplos de respuesta esperada del backend.

---

¿Querés que ajuste algo más o implemente alguna de las recomendaciones? ¡Avisame! 🚀
