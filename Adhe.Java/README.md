# 💼 Repositorio General - Proyectos del Curso Java Back End (Buenos Aires Aprende)

Este repositorio contiene los proyectos desarrollados durante el curso **Java Back End - Buenos Aires Aprende**, organizados por etapas de entrega y evolución.  
Cada carpeta representa un proyecto o práctica diferente, con su respectivo README explicativo, código fuente y ejemplos de ejecución.

---

## 📁 Proyecto `Adhe.PreEntrega`

La carpeta [`Adhe.PreEntrega`](./Adhe.PreEntrega/) contiene el **proyecto de pre entrega** del curso.  
Es una **aplicación de consola en Java**, desarrollada como práctica integradora para aplicar los conceptos fundamentales de **Programación Orientada a Objetos**, **colecciones**, **entrada/salida por consola** y **estructura modular de código**.

### 🧩 Descripción resumida

- **Tipo:** Aplicación de consola
- **Lenguaje:** Java 21
- **IDE:** Visual Studio Code
- **Propósito:** Practicar conceptos de OOP, modularidad y diseño limpio
- **Estructura:** Dividida en _managers_, _services_ y _modelos_ para favorecer la separación de responsabilidades.
- **Calidad de código:** Validada con _SonarLint/SonarQube_.

📘 Para más información técnica, estructura de carpetas y comandos de ejecución, consultá el README interno del proyecto:  
➡️ [`Adhe.PreEntrega/README.md`](./Adhe.PreEntrega/README.md)

---

## 📁 Proyecto `Adhe.EntregaFinal`

La carpeta [`Adhe.EntregaFinal`](./Adhe.EntregaFinal/) contiene dos proyectos complementarios:

1. **Backend:**

   - **Framework:** Spring Boot.
   - **Propósito:** Proveer una API RESTful para gestionar productos, usuarios y pedidos.
   - **Detalles:** Incluye configuración de seguridad, controladores, servicios y repositorios.

2. **Frontend:**
   - **Framework:** React con TypeScript.
   - **Propósito:** Consumir la API del backend y ofrecer una interfaz básica para registro, login y visualización de productos.
   - **Detalles:** Implementación parcial con Redux para el estado global y Vite como herramienta de desarrollo.

📘 Para más información técnica, consultá los README internos de cada proyecto:  
➡️ [`Adhe.EntregaFinal/techlab-backend/README.md`](./Adhe.EntregaFinal/techlab-backend/README.md)  
➡️ [`Adhe.EntregaFinal/techlab-frontend/README.md`](./Adhe.EntregaFinal/techlab-frontend/README.md)

---

#### 🧱 Estructura general del repositorio

    📦 Java-BackEnd-BuenosAiresAprende
    ┣ 📂 Adhe.PreEntrega
    ┃ ┣ 📂 src/
    ┃ ┃ ┣ 📂 com/
    ┃ ┃ ┣ ┣ 📂 techlab/
    ┃ ┃ ┣ ┣ ┣ 📂 exceptiones/
    ┃ ┃ ┣ ┣ ┣ 📂 managers/
    ┃ ┃ ┣ ┣ ┣ 📂 pedidos/
    ┃ ┃ ┣ ┣ ┣ 📂 productos/
    ┃ ┃ ┣ ┣ ┣ 📂 services/
    ┃ ┃ ┣ ┣ ┣ 📂 utils/
    ┃ ┃ ┣ ┣ ┣ ☕ Ap.Java
    ┃ ┣ 📜 README.md
    ┣ 📂 Adhe.EntregaFinal
    ┃ ┣ 📂 techlab-backend/
    ┃ ┃ ┣ 📂 src/
    ┃ ┃ ┣ ┣ 📂 main/java/com/techlab/
    ┃ ┃ ┣ ┣ 📂 test/java/com/techlab/
    ┃ ┣ 📂 techlab-frontend/
    ┃ ┃ ┣ 📂 src/
    ┃ ┃ ┣ ┣ 📂 api/
    ┃ ┃ ┣ ┣ 📂 features/
    ┃ ┃ ┣ ┣ 📂 components/
    ┃ ┃ ┣ ┣ 📂 pages/
    ┃ ┣ 📜 README.md
    ┣ 📜 README.md
