# TechLab Backend

TechLab Backend es una API REST desarrollada con Spring Boot (Java 21) que sirve como base para un sistema de comercio electrónico educativo. Este proyecto está diseñado para demostrar buenas prácticas de desarrollo, incluyendo arquitectura en capas, seguridad con JWT, validaciones robustas y manejo centralizado de errores.

---

## 🚀 Características principales

- **Autenticación y autorización**: Implementación de JWT con control de acceso basado en roles (`ROLE_USER`, `ROLE_ADMIN`).
- **Gestión de recursos**: CRUD para usuarios, productos, categorías y pedidos.
- **Persistencia**: Uso de JPA/Hibernate con MySQL.
- **Validaciones**: Validaciones de datos con `jakarta.validation` y reglas de negocio en servicios.
- **Documentación**: API documentada con OpenAPI/Swagger.
- **Manejo de errores**: Respuestas JSON consistentes mediante un manejador global de excepciones, incluyendo errores de autorización (401) con detalles como timestamp, mensaje y endpoint solicitado.
- **Escalabilidad**: Arquitectura modular que facilita la extensión y el mantenimiento.
- **Seguridad avanzada**: Hash de contraseñas con BCrypt y protección contra ataques comunes como CSRF y XSS.

---

## 🛠️ Tecnologías utilizadas

- **Backend**: Java 21, Spring Boot 3.x
- **Seguridad**: Spring Security, JWT
- **Persistencia**: Spring Data JPA, MySQL
- **Documentación**: OpenAPI/Swagger
- **Otros**: Maven, Jakarta Validation, Lombok

---

## 🏗️ Arquitectura

El proyecto sigue un diseño modular y en capas:

1. **Controladores (Controllers)**: Manejan las solicitudes HTTP y traducen DTOs.
2. **Servicios (Services)**: Contienen la lógica de negocio y validaciones adicionales.
3. **Repositorios (Repositories)**: Interfaces JPA para la persistencia de datos.
4. **Modelos (Models)**: Representan las entidades de la base de datos.
5. **DTOs (Contracts)**: Objetos de transferencia de datos para entrada/salida.
6. **Seguridad (Security)**: Configuración de JWT y filtros de autorización.
7. **Excepciones**: Manejo centralizado de errores con excepciones personalizadas.

Cada capa está diseñada para cumplir con el principio de responsabilidad única, asegurando un código limpio y mantenible.

---

## 📂 Estructura del proyecto

```
techlab-backend/
├── src/
│   ├── main/
│   │   ├── java/com/techlab/
│   │   │   ├── config/          # Configuración (OpenAPI, Seguridad, etc.)
│   │   │   ├── controllers/    # Controladores REST
│   │   │   ├── contracts/      # DTOs y mapeadores
│   │   │   ├── models/         # Entidades JPA
│   │   │   ├── repositories/   # Interfaces JPA
│   │   │   ├── services/       # Lógica de negocio
│   │   │   ├── security/       # Seguridad y JWT
│   │   │   ├── excepciones/    # Manejo de errores
│   ├── resources/              # Archivos de configuración
│   │   ├── application.properties
│   │   ├── static/
│   │   ├── templates/
├── pom.xml                     # Dependencias y configuración de Maven
```

---

## 🔗 Endpoints principales

### Autenticación

- **POST** `/api/auth/login`: Iniciar sesión y obtener un token JWT.
  - **Body**: `{ "email": "user@example.com", "password": "password123" }`
  - **Response**: `{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }`
- **POST** `/api/auth/register`: Registrar un nuevo usuario.
  - **Body**: `{ "nombre": "Juan", "email": "juan@example.com", "password": "password123" }`

### Usuarios

- **GET** `/api/usuarios`: Listar usuarios.
- **POST** `/api/usuarios`: Crear un usuario.
  - **Body**: `{ "nombre": "Maria", "email": "maria@example.com", "password": "password123" }`
- **PUT** `/api/usuarios/{id}`: Actualizar un usuario.
  - **Body**: `{ "nombre": "Maria Actualizada" }`
- **DELETE** `/api/usuarios/{id}`: Eliminación lógica de un usuario.

### Productos

- **GET** `/api/productos`: Listar productos.
- **POST** `/api/productos`: Crear un producto (ADMIN).
  - **Body**: `{ "nombre": "Producto A", "descripcion": "Descripción del producto", "precio": 100.0, "stock": 50, "categoriaId": 1 }`
- **PUT** `/api/productos/{id}`: Actualizar un producto (ADMIN).
  - **Body**: `{ "nombre": "Producto A Actualizado", "precio": 120.0 }`
- **DELETE** `/api/productos/{id}`: Eliminar un producto (ADMIN).

### Pedidos

- **POST** `/api/pedidos`: Crear un pedido.
  - **Body**: `{ "usuarioId": 1, "lineas": [ { "productoId": 1, "cantidad": 2 } ] }`
- **GET** `/api/pedidos`: Listar pedidos.
- **PUT** `/api/pedidos/{id}/estado`: Actualizar el estado de un pedido (ADMIN).
  - **Body**: `{ "estado": "ENVIADO" }`

---

## ⚙️ Configuración y ejecución

### Requisitos previos

- Java 21
- Maven
- MySQL

### Pasos para ejecutar

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Configurar las propiedades en `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/techlab
   spring.datasource.username=tu_usuario
   spring.datasource.password=tu_contraseña
   jwt.secret=tu_secreto_seguro
   jwt.expiration=3600000
   ```
3. Ejecutar la aplicación:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

---
