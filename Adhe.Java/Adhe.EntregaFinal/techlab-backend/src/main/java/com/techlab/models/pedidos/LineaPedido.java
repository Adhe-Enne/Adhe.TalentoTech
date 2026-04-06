package com.techlab.models.pedidos;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
public class LineaPedido extends com.techlab.models.BaseEntity {

  @NotNull(message = "El ID del producto no puede ser nulo.")
  private Long productoId;

  @NotNull(message = "La cantidad no puede ser nula.")
  @Min(value = 1, message = "La cantidad debe ser al menos 1.")
  private Integer cantidad;

  @PositiveOrZero(message = "El subtotal no puede ser negativo.")
  private Double subtotal;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "pedido_id")
  @JsonIgnore
  private Pedido pedido;

  // Getters y setters

  public Long getProductoId() {
    return productoId;
  }

  public void setProductoId(Long productoId) {
    this.productoId = productoId;
  }

  public Integer getCantidad() {
    return cantidad;
  }

  public void setCantidad(Integer cantidad) {
    this.cantidad = cantidad;
  }

  public Double getSubtotal() {
    return subtotal;
  }

  public void setSubtotal(Double subtotal) {
    this.subtotal = subtotal;
  }

  public Pedido getPedido() {
    return pedido;
  }

  public void setPedido(Pedido pedido) {
    this.pedido = pedido;
  }
}
