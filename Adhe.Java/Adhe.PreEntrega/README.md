# 🧩 Proyecto Pre Entrega - Curso Java Back End (Buenos Aires Aprende)

Proyecto Pre Entrega para el curso Java Back End "Buenos Aires Aprende".  
Es una aplicación de consola que sigue la consigna de la pre entrega, pero me di libertad creativa a la hora de desarrollar la app. Por decisión personal opté por elevar un poco más la complejidad en clases y funciones: adopté una separación clara entre managers, servicios y modelos para facilitar mantenimiento y pruebas. Ya contaba con conocimientos previos en Java, por lo que el desarrollo en consola fue directo. El proyecto fue construido en Visual Studio Code con varias extensiones Java y, como buena práctica, usé SonarQube/SonarLint para mejorar la sintaxis y la calidad del código.

---

## 🚀 Resumen rápido

- Tipo: Aplicación de consola (entrada por Scanner)  
- Lenguaje: Java 21 (compatible con compiladores modernos de Java)  
- Propósito: Practicar y demostrar manejo de OOP, colecciones, I/O por consola y diseño modular.

---

## ✅ Funcionalidades destacadas

- Gestión de productos: alta, listado, búsqueda, actualización y eliminación.  
- Gestión de pedidos: creación y listado de pedidos con múltiples líneas.  
- Soporte de datos precargados para pruebas rápidas.  
- Diseño modular con responsabilidades separadas (managers vs services vs modelos).

---

## 🏗️ Estructura completa de carpetas y principales objetos

Raíz del proyecto
- .vscode/ (configuración de VS Code)
- src/
  - com/
    - techlab/
      - managers/
        - BusinessManager.java — coordina la aplicación y permite precarga de datos  
        - ProductoManager.java — interacción por consola para productos  
        - PedidoManager.java — interacción por consola para pedidos
      - services/
        - ProductoService.java — lógica y "persistencia" en memoria de productos  
        - PedidoService.java — lógica y "persistencia" en memoria de pedidos
      - pedidos/
        - Pedido.java — modelo de pedido (contiene líneas, id, etc.)  
        - LineaPedido.java — modelo de línea de pedido (producto, cantidad, referencia al pedido)
      - app/ (opcional)
        - Main.java — clase con método main para iniciar la aplicación (si existe)
- lib/ (dependencias externas si las hubiese)
- out/ o bin/ (salida de compilación)
- README.md

Nota: la lista anterior refleja las clases y paquetes usados por el proyecto; si usás un Main distinto o paquetes extras, ajustá según corresponda.

---

## ⚙️ Cómo compilar y ejecutar (Windows)

Desde PowerShell en la raíz del proyecto:

1. Compilar:
   ```powershell
    # Crear carpeta de salida
    New-Item -ItemType Directory -Force -Path .\out

    # Obtener lista de .java y compilar
    $files = Get-ChildItem -Path .\src -Recurse -Filter *.java | ForEach-Object { $_.FullName }
    & javac -d out $files

    # Ejecutar la aplicación
    & java -cp out com.techlab.App
   ```
2. Ejecutar (ajustar paquete/clase con main):
   ```powershell
    # Ejecutar la aplicación
    & java -cp out com.techlab.App
   ```
3. _⚠️(Opcional/Alternativo) Limpiar Archivos de ejecucion:_
    ```powershell
    Remove-Item -Recurse -Force .\out
    Remove-Item -Force .\sources.txt  # solo si existe
    ```
---
## ⌨️ Extensiones de VS Code utilizadas

En el desarrollo de este proyecto se utilizaron las siguientes extensiones para mejorar la productividad, depuración y calidad del código:

- Extension Pack for Java — conjunto base con herramientas esenciales para Java en VS Code.  
- Language Support for Java(TM) by Red Hat — soporte de lenguaje (sintaxis, autocompletado).  
- Debugger for Java — depuración paso a paso de aplicaciones Java.  
- Test Runner for Java — ejecución y administración de pruebas unitarias (JUnit).  
- Maven for Java — integración y manejo de proyectos Maven (si corresponde).  
- Visual Studio IntelliCode — autocompletado inteligente asistido por IA.  
- SonarLint — análisis estático en el editor para mejorar calidad y detectar smells.  
- Java Dependency Viewer — facilita la navegación y gestión de dependencias del proyecto.

> Ajustá la lista según las extensiones que tengas instaladas localmente. Estas son las que usé y recomiendo para trabajar con proyectos Java en VS Code.

---

## 🔁 Habilitar datos precargados

La clase BusinessManager tiene un constructor con bandera para precarga:
- new BusinessManager(scanner, true);  
Activa la creación automática de productos y pedidos de ejemplo para pruebas.

---

## 🖼️ Capturas de pantalla / Salida de consola

Images de consola:

Menú principal  
<img width="999" height="304" alt="image" src="https://github.com/user-attachments/assets/074d0b7a-ff80-4957-a1a9-d08990df775a"/>

Listado de Productos
<img width="1091" height="371" alt="image" src="https://github.com/user-attachments/assets/4952e37a-32f0-4697-9397-2da6c2ba4838"/>


 

