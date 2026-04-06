package com.techlab.pedidos;

import com.techlab.productos.Producto;

public class LineaPedido {
  private static int nextId = 1;
  private Producto producto;
  private int productoId;
  private int cantidad;
  private int id;
  private int pedidoId;

  public LineaPedido(int productoId, int cantidad, int pedidoId) {
    this.productoId = productoId;
    this.cantidad = cantidad;
    this.id = nextId++;
    this.pedidoId = pedidoId;
  }

  public int getProductoId() {
    return productoId;
  }

  public void setProductoId(int productoId) {
    this.productoId = productoId;
  }

  public Producto getProducto() {
    return producto;
  }

  public int getId() {
    return id;
  }

  public int getPedidoId() {
    return pedidoId;
  }

  public void setProducto(Producto producto) {
    this.producto = producto;
  }

  public int getCantidad() {
    return cantidad;
  }

  public void setCantidad(int cantidad) {
    this.cantidad = cantidad;
  }

  public double getSubtotal() {
    return producto.getPrecio() * cantidad;
  }
}
