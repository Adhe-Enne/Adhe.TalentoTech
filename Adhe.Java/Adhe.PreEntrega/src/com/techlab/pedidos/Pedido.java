package com.techlab.pedidos;

import java.util.ArrayList;
import java.util.List;

public class Pedido {
  private int id;
  private List<LineaPedido> lineas;

  public Pedido(int id) {
    this.id = id;
    this.lineas = new ArrayList<>();
  }

  public int getId() {
    return id;
  }

  public List<LineaPedido> getLineas() {
    return lineas;
  }

  public void agregarLinea(LineaPedido linea) {
    this.lineas.add(linea);
  }

  public double getTotal() {
    return lineas.stream().mapToDouble(LineaPedido::getSubtotal).sum();
  }
}
