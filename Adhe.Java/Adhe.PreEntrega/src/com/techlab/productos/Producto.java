package com.techlab.productos;

public class Producto {
  private int id;
  private String nombre;
  private float precio;
  private int stock;

  public Producto(int id, String nombre, float precio, int stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getNombre() {
    return nombre;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public float getPrecio() {
    return precio;
  }

  public void setPrecio(float precio) {
    this.precio = precio;
  }

  public int getStock() {
    return stock;
  }

  public void setStock(int stock) {
    this.stock = stock;
  }

  @Override
  public String toString() {
    return String.format("ID: %d | %s | $%.2f | Stock: %d", id, nombre, precio, stock);
  }
}
