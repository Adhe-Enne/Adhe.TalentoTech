package com.techlab.services;

import com.techlab.productos.Producto;
import java.util.ArrayList;
import java.util.List;

public class ProductoService {
  private ArrayList<Producto> productos = new ArrayList<>();
  private static int nextId = 1;

  public Producto agregarProducto(String nombre, float precio, int stock) {
    Producto p = new Producto(getNextId(), nombre, precio, stock);
    productos.add(p);
    return p;
  }

  public static int getNextId() {
    return nextId++;
  }

  public List<Producto> getProductos() {
    return productos;
  }

  public Producto buscarPorId(int id) {
    return productos.stream().filter(p -> p.getId() == id).findFirst().orElse(null);
  }

  public Producto buscarPorNombre(String nombre) {
    return productos.stream()
        .filter(
            p -> p.getNombre().equalsIgnoreCase(nombre) || p.getNombre().toLowerCase().startsWith(nombre.toLowerCase()))
        .findFirst()
        .orElse(null);
  }

  public boolean existeProducto(String nombre) {
    return productos.stream().anyMatch(p -> p.getNombre().equalsIgnoreCase(nombre));
  }

  public boolean eliminarProducto(int id) {
    return productos.removeIf(p -> p.getId() == id);
  }

  public boolean existenProductosConStock() {
    return !productos.isEmpty() && productos.stream().anyMatch(p -> p.getStock() > 0);
  }
}
