package com.techlab.contracts.dtos;

import java.time.LocalDateTime;
import java.util.List;

public class PedidoResponse {
  private Long id;
  private Long usuarioId;
  private String estado;
  private LocalDateTime fechaCreacion;
  private Double total;
  private List<LineaPedidoResponse> lineasPedido;

  // Logical delete fields
  private Boolean deleted;
  private LocalDateTime deletedAt;
  private LocalDateTime updatedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

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

  public List<LineaPedidoResponse> getLineasPedido() {
    return lineasPedido;
  }

  public void setLineasPedido(List<LineaPedidoResponse> lineasPedido) {
    this.lineasPedido = lineasPedido;
  }

  public Boolean getDeleted() {
    return deleted;
  }

  public void setDeleted(Boolean deleted) {
    this.deleted = deleted;
  }

  public LocalDateTime getDeletedAt() {
    return deletedAt;
  }

  public void setDeletedAt(LocalDateTime deletedAt) {
    this.deletedAt = deletedAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}
