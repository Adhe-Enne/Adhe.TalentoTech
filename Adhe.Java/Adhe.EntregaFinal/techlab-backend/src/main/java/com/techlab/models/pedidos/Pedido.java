package com.techlab.models.pedidos;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Pedido extends com.techlab.models.BaseEntity {

  @NotNull(message = "El ID del usuario no puede ser nulo.")
  private Long usuarioId;

  @NotNull(message = "El estado no puede ser nulo.")
  @Size(min = 1, message = "El estado no puede estar vacío.")
  private String estado;

  private LocalDateTime fechaCreacion;

  @PositiveOrZero(message = "El total no puede ser negativo.")
  private Double total;

  @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<LineaPedido> lineasPedido = new ArrayList<>();

  // Getters y setters

  public Long getUsuarioId() {
    return usuarioId;
  }

  public void setUsuarioId(Long usuarioId) {
    this.usuarioId = usuarioId;
  }

  public String getEstado() {
    return estado;
  }

  public void setEstado(String estado) {
    this.estado = estado;
  }

  public LocalDateTime getFechaCreacion() {
    return fechaCreacion;
  }

  public void setFechaCreacion(LocalDateTime fechaCreacion) {
    this.fechaCreacion = fechaCreacion;
  }

  public Double getTotal() {
    return total;
  }

  public void setTotal(Double total) {
    this.total = total;
  }

  public List<LineaPedido> getLineasPedido() {
    return lineasPedido;
  }

  public void setLineasPedido(List<LineaPedido> lineasPedido) {
    this.lineasPedido = lineasPedido;
  }
}
