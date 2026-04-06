package com.techlab.contracts.dtos;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class PedidoRequest {
  @NotNull
  private Long usuarioId;

  @NotNull
  private List<LineaPedidoRequest> itemsPedido;

  public Long getUsuarioId() {
    return usuarioId;
  }

  public void setUsuarioId(Long usuarioId) {
    this.usuarioId = usuarioId;
  }

  public List<LineaPedidoRequest> getItemsPedido() {
    return itemsPedido;
  }

  public void setItemsPedido(List<LineaPedidoRequest> itemsPedido) {
    this.itemsPedido = itemsPedido;
  }
}
