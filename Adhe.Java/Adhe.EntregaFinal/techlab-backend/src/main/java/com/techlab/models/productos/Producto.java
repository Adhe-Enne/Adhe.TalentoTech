package com.techlab.models.productos;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Producto extends com.techlab.models.BaseEntity {

  @NotNull(message = "El nombre no puede ser nulo")
  @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
  private String nombre;

  @Size(max = 255, message = "La descripción no puede exceder los 255 caracteres")
  private String descripcion;

  @NotNull(message = "El precio no puede ser nulo")
  @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor que 0")
  private Double precio;

  @NotNull(message = "El stock no puede ser nulo")
  @Min(value = 0, message = "El stock no puede ser negativo")
  private Integer stock;

  @NotNull(message = "El ID de la categoría no puede ser nulo")
  private Long categoriaId;

  @Size(max = 255, message = "La URL de la imagen no puede exceder los 255 caracteres")
  private String imagenUrl;

  // Getters y Setters
  public String getNombre() {
    return nombre;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public String getDescripcion() {
    return descripcion;
  }

  public void setDescripcion(String descripcion) {
    this.descripcion = descripcion;
  }

  public Double getPrecio() {
    return precio;
  }

  public void setPrecio(Double precio) {
    this.precio = precio;
  }

  public Integer getStock() {
    return stock;
  }

  public void setStock(Integer stock) {
    this.stock = stock;
  }

  public Long getCategoriaId() {
    return categoriaId;
  }

  public void setCategoriaId(Long categoriaId) {
    this.categoriaId = categoriaId;
  }

  public String getImagenUrl() {
    return imagenUrl;
  }

  public void setImagenUrl(String imagenUrl) {
    this.imagenUrl = imagenUrl;
  }
}