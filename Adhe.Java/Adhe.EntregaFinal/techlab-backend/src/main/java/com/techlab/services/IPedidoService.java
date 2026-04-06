package com.techlab.services;

import com.techlab.models.pedidos.Pedido;
import java.util.List;

public interface IPedidoService {
  Pedido crearPedido(Pedido pedido);

  List<Pedido> listarPedidosPorUsuario(Long usuarioId);

  List<Pedido> listarPedidos();

  Pedido actualizarEstadoPedido(Long id, String estado);

  // Physical delete (permanent)
  void eliminarFisicamente(Long id);

  // Logical delete (soft)
  Pedido eliminarLogicamente(Long id);

  // Backwards compatible alias
  default void eliminarPedido(Long id) {
    eliminarFisicamente(id);
  }
}
