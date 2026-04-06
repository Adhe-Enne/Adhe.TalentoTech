package com.techlab.managers;

import com.techlab.excepciones.ProductoNoEncontradoException;
import com.techlab.productos.Producto;
import com.techlab.services.ProductoService;
import com.techlab.util.Console;
import java.util.Scanner;

public class ProductoManager {
  private final ProductoService prodService;
  private final Scanner scanner;

  public ProductoManager(Scanner scanner, ProductoService prodService) {
    this.prodService = prodService;
    this.scanner = scanner;
  }

  public void agregarProducto(String nombre, float precio, int stock) {
    prodService.agregarProducto(nombre, precio, stock);
  }

  public void agregarProducto() {
    while (true) {
      crearProducto();
      if (!Console.confirmar("¿Desea agregar otro producto? (s/n): "))
        break;
    }

    Console.esperarEnter();
  }

  public void crearProducto() {
    Console.imprimirEncabezado("Agregar Producto");

    Console.cout("Nombre: ");
    String nombre = scanner.nextLine();

    while (true) {
      if (nombre.isBlank())
        Console.coutln("El nombre no puede estar vacío. Ingrese un nombre válido.");
      else if (prodService.existeProducto(nombre))
        Console.coutln("Ya existe un producto con ese nombre. Ingrese un nombre diferente.");
      else if (!nombre.matches("^[a-zA-Z].*"))
        Console.coutln("El nombre debe iniciar con una letra. Ingrese un nombre válido.");
      else
        break;

      Console.cout("Nombre: ");
      nombre = scanner.nextLine();
    }

    float precio = solicitarPrecio();
    int stock = solicitarStock();

    Producto p = prodService.agregarProducto(nombre, precio, stock);
    Console.imprimirEncabezado("Producto agregado: " + p);
  }

  public void listarProductos() {
    Console.imprimirEncabezado("Lista de Productos");

    if (prodService.getProductos().isEmpty())
      Console.coutln("No hay productos registrados.");
    else
      prodService.getProductos().forEach(p -> Console.coutln(p.toString()));

    Console.imprimirSeparador();
    Console.esperarEnter();
  }

  public void buscarActualizarProducto() {
    Console.imprimirEncabezado("Buscar/Actualizar Producto");

    try {
      Console.cout("Ingrese el ID o el nombre del producto: ");
      Producto producto = buscarProducto();
      Console.imprimirEncabezado("Producto encontrado: " + producto);

      if (!confirmarActualizacion()) {
        Console.imprimirFinProceso("No se realizaron cambios.");
        return;
      }

      float nuevoPrecio = solicitarNuevoPrecio(producto.getPrecio());
      producto.setPrecio(nuevoPrecio);

      int nuevoStock = solicitarNuevoStock(producto.getStock());
      producto.setStock(nuevoStock);

      if (Console.confirmar("¿Desea cambiar el nombre del producto? (s/n): "))
        producto.setNombre(solicitarNuevoNombre(producto.getNombre()));

      Console.imprimirSeparador();
      Console.coutln("Producto actualizado: " + producto);
    } catch (ProductoNoEncontradoException ex) {
      Console.coutln(ex.getMessage());
    }

    Console.imprimirSeparador();
    Console.esperarEnter();
  }

  public void eliminarProducto() {
    Console.imprimirEncabezado("Eliminar Producto");

    try {
      Console.cout("Ingrese el ID o el nombre del producto a eliminar: ");
      Producto producto = buscarProducto();

      Console.imprimirEncabezado("Producto encontrado: " + producto);

      if (!Console.confirmar("¿Está seguro que desea eliminar este producto?")) {
        Console.imprimirFinProceso("No se realizó ninguna acción.");
        return;
      }

      if (prodService.eliminarProducto(producto.getId()))
        Console.coutln("Producto eliminado correctamente.");
      else
        Console.coutln("No se pudo eliminar el producto.");
    } catch (ProductoNoEncontradoException ex) {
      Console.coutln(ex.getMessage());
    }

    Console.imprimirSeparador();
    Console.esperarEnter();
  }

  private Producto buscarProducto() {
    Producto producto = null;
    String input = scanner.nextLine();

    try {
      int id = Integer.parseInt(input);
      producto = prodService.buscarPorId(id);
    } catch (NumberFormatException _) {
      producto = prodService.buscarPorNombre(input);
    }

    if (producto == null)
      throw new ProductoNoEncontradoException("Producto no encontrado.");

    return producto;
  }

  private boolean confirmarActualizacion() {
    return Console.confirmar("¿Desea actualizar este producto? (s/n): ");
  }

  private float solicitarPrecio() {
    float precio = 0f;

    while (true) {
      Console.cout("Precio: ");
      String input = scanner.nextLine();

      try {
        precio = Float.parseFloat(input);
        if (precio > 0)
          break;

        Console.coutln("El precio debe ser positivo.");
      } catch (NumberFormatException _) {
        Console.coutln("Ingrese un valor numérico válido para el precio.");
      }
    }
    return precio;
  }

  private int solicitarStock() {
    int stock = 0;

    while (true) {
      Console.cout("Stock: ");
      String input = scanner.nextLine();

      try {
        stock = Integer.parseInt(input);

        if (stock > 0)
          break;

        Console.coutln("El stock no puede ser negativo.");
      } catch (NumberFormatException _) {
        Console.coutln("Ingrese un valor entero válido para el stock.");
      }
    }
    return stock;
  }

  private float solicitarNuevoPrecio(float precioActual) {
    Console.cout("Nuevo precio (actual: " + precioActual + "): ");
    float p = 0f;
    String inputPrecio;

    while (true) {
      inputPrecio = scanner.nextLine();

      try {
        if (!inputPrecio.isBlank()) {
          p = Float.parseFloat(inputPrecio);
          if (p < 0)
            Console.coutln("El precio no puede ser negativo. Ingrese un valor válido.");
          else if (p == 0)
            Console.coutln("El precio no puede ser cero. Ingrese un valor válido.");
          else if (p == precioActual)
            Console.coutln("El precio es igual al actual. Ingrese un precio diferente.");
          else
            break;
        } else
          Console.coutln("El precio no puede estar vacío. Ingrese un valor válido.");
      } catch (NumberFormatException _) {
        Console.coutln("Valor inválido. Ingrese un precio válido.");
      }
    }
    return p;
  }

  private int solicitarNuevoStock(int stockActual) {
    Console.cout("Nuevo stock (actual: " + stockActual + "): ");
    int nuevoStock = 0;

    while (true) {
      String inputStock = scanner.nextLine();

      if (inputStock != null && !inputStock.isBlank()) {
        try {
          nuevoStock = Integer.parseInt(inputStock);
          if (nuevoStock == stockActual)
            Console.coutln("El stock es igual al actual. Ingrese un stock diferente.");
          else if (nuevoStock == 0)
            Console.coutln("El Stock no puede ser cero.");
          else if (nuevoStock < 0)
            Console.coutln("El Stock no puede ser negativo.");
          else
            break;
        } catch (NumberFormatException _) {
          Console.coutln("Valor inválido. Ingrese un stock válido.");
        }
      } else
        Console.coutln("El stock no puede estar vacío. Ingrese un valor válido.");
    }
    return nuevoStock;
  }

  private String solicitarNuevoNombre(String nombreActual) {
    String nombre;
    Console.cout("Nuevo nombre (actual: " + nombreActual + "): ");

    while (true) {
      nombre = scanner.nextLine();

      if (nombre.isBlank())
        Console.coutln("El nombre no puede estar vacío.");
      else if (nombre.equalsIgnoreCase(nombreActual)) {
        Console.coutln("El nombre es igual al actual. Ingrese un nombre diferente.");
      } else if (prodService.existeProducto(nombre))
        Console.coutln("Ya existe un producto con ese nombre. Ingrese un nombre diferente.");
      else
        break;
    }
    return nombre;
  }
}