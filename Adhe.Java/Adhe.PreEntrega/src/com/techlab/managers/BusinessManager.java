
package com.techlab.managers;

import com.techlab.services.ProductoService;
import com.techlab.pedidos.LineaPedido;
import com.techlab.pedidos.Pedido;
import com.techlab.services.PedidoService;
import java.util.Scanner;

public class BusinessManager {
  private final ProductoManager productoManager;
  private final PedidoManager pedidoManager;

  public BusinessManager(Scanner scanner) {
    this(scanner, false);
  }

  public BusinessManager(Scanner scanner, boolean stockPrecargado) {
    ProductoService productoService = new ProductoService();
    PedidoService pedidoService = new PedidoService();

    this.productoManager = new ProductoManager(scanner, productoService);
    this.pedidoManager = new PedidoManager(scanner, pedidoService, productoService);

    if (stockPrecargado) {
      precargarProductos();
    }
  }

  public void agregarProducto() {
    productoManager.agregarProducto();
  }

  public void listarProductos() {
    productoManager.listarProductos();
  }

  public void buscarActualizarProducto() {
    productoManager.buscarActualizarProducto();
  }

  public void eliminarProducto() {
    productoManager.eliminarProducto();
  }

  public void crearPedido() {
    pedidoManager.crearPedido();
  }

  public void listarPedidos() {
    pedidoManager.listarPedidos();
  }

  // Metodo de test para validar funcionalidades con datos precargados
  private void precargarProductos() {
    productoManager.agregarProducto("Café Premium", 1500.5f, 10);
    productoManager.agregarProducto("Té Verde", 1200.0f, 20);
    productoManager.agregarProducto("Yerba Mate", 900.0f, 15);
    productoManager.agregarProducto("Azúcar", 500.0f, 30);
    productoManager.agregarProducto("Leche", 800.0f, 25);
    productoManager.agregarProducto("Galletas", 600.0f, 40);
    productoManager.agregarProducto("Mermelada", 1100.0f, 12);
    productoManager.agregarProducto("Pan Integral", 700.0f, 18);

    Pedido pedido = pedidoManager.agregarPedido();
    pedido.agregarLinea(new LineaPedido(1, 10, pedido.getId()));
    pedido.agregarLinea(new LineaPedido(3, 5, pedido.getId()));

    Pedido pedido2 = pedidoManager.agregarPedido();
    pedido2.agregarLinea(new LineaPedido(2, 8, pedido2.getId()));
    pedido2.agregarLinea(new LineaPedido(4, 12, pedido2.getId()));
  }
}