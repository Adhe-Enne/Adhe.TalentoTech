package com.techlab.models.categorias;

import com.techlab.models.BaseEntity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
public class Categoria extends BaseEntity {

  @NotNull(message = "El nombre no puede ser nulo")
  @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
  private String nombre;

  @Size(max = 255)
  private String descripcion;

  private boolean activo = true;

  // Getters y setters
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

  public boolean isActivo() {
    return activo;
  }

  public void setActivo(boolean activo) {
    this.activo = activo;
  }
}
