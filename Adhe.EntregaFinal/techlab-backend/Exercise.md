# Entrega de Proyecto Final

> Portada
- Entrega de Proyecto Final

---

## Objetivo general
Desarrollar una API RESTful completa en Java utilizando Spring Boot y MySQL para gestionar un sistema de E-commerce, integrándose con una aplicación frontend. La aplicación deberá aplicar correctamente conceptos avanzados de programación en Java, arquitectura REST, bases de datos relacionales, validaciones, excepciones y organización modular.

---

## Requisitos funcionales (extraídos de las diapositivas)

### Eliminación de productos
- El sistema debe permitir eliminar un producto de la lista, identificándolo por su ID o posición en la colección.
- Antes de eliminar, el sistema podría pedir confirmación (opcionales).

### Creación de pedidos
- Además de manejar productos, se sugiere agregar la clase Pedido (o Orden) que contenga:
  - Una lista de productos asociados.
  - Cantidad deseada de cada producto (por ejemplo, usando un objeto intermedio `LineaPedido` o similar).

- El sistema debe permitir crear un pedido nuevo:
  a. Solicitar al usuario qué productos desea y en qué cantidad (validar que haya suficiente stock).
  b. Calcular el costo total (sumando `precio * cantidad` de cada producto).
  c. Disminuir el stock de cada producto si el pedido se confirma.

---

## Menú principal interactivo (requisitos HTML / UX)
El HTML tendrá una opción que permitirá:
- Crear y registrar nuevos pedidos.
- Historial de pedidos por usuario.
- Gestión del estado de pedidos (pendiente, confirmado, enviado, entregado, cancelado).
- Actualización automática de stock al confirmar pedidoAlertas o reportes cuando el stock alcance niveles mínimos.
  - Nota: en el material aparece "pedidoAlertas" pegado; probablemente son dos ideas separadas: "al confirmar pedido" y "Alertas o reportes cuando el stock alcance niveles mínimos".
- Crear un pedido
- Listar pedidos

---

## Requisitos que debe poseer el HTML
SISTEMA DE GESTIÓN - TECHLAB

1) Gestionar Productos  
2) Gestionar Categorías  
3) Ver Carrito de Compras  
4) Realizar Pedido  
5) Consultar Historial de Pedidos  
6) Administración (usuarios y stock)  
7) Salir

---

## Ejemplo de la sección Gestión de productos
Gestión de Productos — menú ejemplo:
a) Agregar Producto  
b) Listar Productos  
c) Buscar Producto por ID  
d) Actualizar Producto  
e) Eliminar Producto  
f) Volver al menú principal

---

## 2. Template de Proyecto
En caso de elegir el template; es esencial elegir una temática adecuada que se alinee con los productos o servicios que que queres ofrecer. Una vez seleccionada la temática, realizaremos las personalizaciones y modificaciones necesarias en el template para adaptarlo a nuestras necesidades específicas.

- Github Pages  
- Repositorio de Github

Elementos a definir:
1. Nombre del Proyecto: Elegir un nombre que sea memorable y represente la esencia de la marca.  
2. Imágenes a Utilizar: Seleccionar imágenes que resalten los productos y reflejen la temática elegida.  
3. Textos: Redactar textos claros y persuasivos para las descripciones de productos, secciones del sitio y demás contenido relevante.  
4. Paleta de Colores: Definir una paleta de colores que complemente la temática seleccionada y que ayude a crear una experiencia visual atractiva.

Al finalizar estas definiciones, procederemos a implementar los temas que abordamos en la cursada, asegurándonos de que el resultado final sea un sitio de e-commerce atractivo y funcional.

---

## Requerimientos técnicos

### Tipos de datos y variables
- Emplear variables de tipo `int` (para cantidades e IDs), `double` (para precios), `String` (para nombres/descripciones), y `boolean` si fuera necesario.
- Asegurate de usar operadores aritméticos, lógicos y relacionales en las funciones de cálculo y validación.

### Colecciones (Arrays, Listas)
- Para manejar los productos, se sugiere un `ArrayList<Producto>`.
- Para manejar los productos dentro de un pedido, podría usarse otra lista, por ejemplo `ArrayList<LineaPedido>`.
- O bien, un `Map<Integer, Integer>` si querés asociar ID de producto con cantidad solicitada (detalles a tu elección).

---

## POO y Colaboración de Clases
- Clase Producto: con atributos `id`, `nombre`, `precio`, `stock`, getters y setters.
- Clase Pedido (u Orden): con atributos `id`, lista de productos/lineas, metodos para calcular total, etc.
- Clase Principal (Main): orquesta el menú, invoca métodos de servicios (por ejemplo, un `ProductoService` que encapsule la lógica de agregar/buscar/eliminar).

### Herencia / Polimorfismo (opcional para extender)
- Si deseás, podés crear subclases de `Producto` (por ejemplo, `Bebida`, `Comida`) con atributos específicos (fecha de vencimiento, volumen en litros, etc.).
- Mostrar cómo el polimorfismo ayuda a tratar distintos productos de forma genérica.

---

## Excepciones
- Manejar errores con `try/catch`. Por ejemplo, al convertir datos ingresados por la usuaria o usuario, podrías atrapar `NumberFormatException` si ingresa texto en lugar de un número.
- Podrías crear una excepción personalizada como `StockInsuficienteException` y lanzarla cuando se intenta crear un pedido con cantidad mayor al stock disponible.

---

## Paquetes / módulos (organización de código)
Dividir las clases en paquetes lógicos, por ejemplo:
- `com.techlab.productos` (para `Producto`, `Bebida`, etc.)  
- `com.techlab.pedidos` (para `Pedido`, `LineaPedido`)  
- `com.techlab.excepciones` (para excepciones personalizadas)

---

## Ejemplo de flujo de uso (escenario) — Resumen y verbatim de las diapositivas

- Barra de navegación (ejemplo visual en las slides):
  ```
  [Inicio] [Productos] [Categorías] [Carrito] [Pedidos]
  ```

1) El usuario selecciona la opción "Productos":  
- La página envía una petición HTTP GET a la API REST:  
  `GET /api/productos`  
  - La API responde con una lista en formato JSON que contiene todos los productos disponibles.  
  - El frontend renderiza esta lista mostrando ID, nombre, precio, categoría y stock.

2) El usuario hace clic en el botón "Agregar Producto":  
- Se abre un formulario HTML con campos para ingresar:
  - Nombre del producto
  - Descripción
  - Precio
  - Categoría (selección desplegable)
  - URL de Imagen
  - Cantidad en Stock

- Al completar el formulario y presionar "Guardar", el frontend hace una petición HTTP POST:
  `POST /api/productos`
  - Con el cuerpo del mensaje JSON (ejemplo de la diapositiva):
  ```json
  {
    "nombre": "Café Premium",
    "descripcion": "Café colombiano tostado",
    "precio": 12.50,
    "categoriaId": 3,
    "imagenUrl": "http://ejemplo.com/cafe.jpg",
    "stock": 100
  }
  ```
  - La API valida y guarda el producto en la base de datos.
  - El producto ahora se refleja automáticamente en la lista mostrada en el frontend.

3) El usuario selecciona la opción "Carrito":
- La interfaz web muestra los productos actualmente en el carrito del usuario. Al presionar "Realizar pedido", se ejecuta una petición HTTP POST:
  `POST /api/pedidos`
- Ejemplo de JSON para crear pedido (ejemplo de la diapositiva):
  ```json
  {
    "usuarioId": 5,
    "itemsPedido": [
      { "productoId": 10, "cantidad": 2 },
      { "productoId": 15, "cantidad": 1 }
    ]
  }
  ```
- La API REST valida que haya suficiente stock para cada producto:
  - Si hay suficiente stock, la API confirma el pedido, descuenta el stock de los productos involucrados y genera un registro del pedido en estado "pendiente".
  - Si no hay suficiente stock, responde con un código HTTP `400 Bad Request` junto a un mensaje claro indicando el problema (por ejemplo, `StockInsuficienteException`).

4) El usuario selecciona la opción "Pedidos":  
- Se realiza una petición HTTP GET a la API REST:  
  `GET /api/usuarios/5/pedidos`  
  - La API devuelve un historial de pedidos realizados por el usuario actual y muestra los detalles como número del pedido, fecha, estado actual del pedido, costo total, y productos involucrados.

5) Finalmente, al seleccionar "Salir":  
- El frontend gestiona la finalización de la sesión del usuario.

---

## Notas de lectura / confianza
- Mantuve el texto casi literal desde las diapositivas. Donde noté una unión de palabras o posibles confusiones (por ejemplo, `pedidoAlertas`), lo indiqué entre corchetes en la sección correspondiente.
- En varias diapositivas faltan tildes en palabras como "Asegurate", "Gestion" o "metodos"; las mantuve tal cual aparecían en las imágenes para respetar el original.
- Si querés que normalice ortografía y acentos en todo el documento, lo hago en otra versión.

---

## Sugerencias de implementación práctica (enriquecimiento, opcional)
Teniendo en cuenta que vas a usar https://start.spring.io/ (Spring Initializr) para generar el proyecto, sugiero lo siguiente al crear el proyecto:

- Dependencias recomendadas en Spring Initializr:
  - Spring Web
  - Spring Data JPA
  - MySQL Driver (o MariaDB)
  - Spring Validation (opcional, suele venir con Spring Web)
  - Lombok (opcional, para reducir boilerplate)
  - Spring Boot DevTools (opcional, para desarrollo)
  - Spring Security (opcional, si requieres autenticación)

- Estructura de paquetes sugerida:
  - `com.techlab.productos` — entidades `Producto`, `Bebida`, etc.
  - `com.techlab.pedidos` — entidades `Pedido`, `LineaPedido`, servicios y DTOs.
  - `com.techlab.usuarios` — (si implementás usuarios) entidad `Usuario`, repositorio, servicio.
  - `com.techlab.excepciones` — `StockInsuficienteException`, `GlobalExceptionHandler` (ControllerAdvice).
  - `com.techlab.config` — configuración (DB, CORS, Swagger si se agrega).
  - `com.techlab.controllers` — controladores REST (`ProductoController`, `PedidoController`, `UsuarioController`).
  - `com.techlab.services` — `ProductoService`, `PedidoService`, etc.
  - `com.techlab.repositories` — interfaces JPA `ProductoRepository`, `PedidoRepository`.

- Endpoints mínimos sugeridos:
  - GET `/api/productos` — listar productos
  - POST `/api/productos` — crear producto
  - GET `/api/productos/{id}` — obtener producto por id
  - PUT `/api/productos/{id}` — actualizar producto
  - DELETE `/api/productos/{id}` — eliminar producto
  - POST `/api/pedidos` — crear pedido (recibe lista de items y `usuarioId`)
  - GET `/api/usuarios/{id}/pedidos` — historial de pedidos por usuario

- Manejo de errores / respuestas:
  - Usar `ResponseEntity` con códigos HTTP claros.
  - Lanzar `StockInsuficienteException` cuando corresponda y mapearla a `400 Bad Request` con mensaje JSON informativo.
  - Validaciones con `@Valid` y `@NotNull`, `@Min`, `@Size`, etc.

- Base de datos:
  - MySQL con tablas `productos`, `pedidos`, `linea_pedido`, `usuarios`, `categorias`.
  - Relaciones: `Pedido` 1..* `LineaPedido`; `LineaPedido` referencia `Producto`.

- Tests:
  - Tests unitarios para servicios (`ProductoService`, `PedidoService`) y tests de integración para controladores si es requerido por la cursada.

- Documentación:
  - Considerá agregar Swagger/OpenAPI para documentar los endpoints durante desarrollo.

---


