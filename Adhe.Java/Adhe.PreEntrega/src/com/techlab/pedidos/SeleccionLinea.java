package com.techlab.pedidos;

import com.techlab.productos.Producto;

public class SeleccionLinea {
  private Producto producto;
  private int cantidad;

  public SeleccionLinea(Producto producto, int cantidad) {
    this.producto = producto;
    this.cantidad = cantidad;
  }

  public Producto getProducto() {
    return producto;
  }

  public int getCantidad() {
    return cantidad;
  }
}
