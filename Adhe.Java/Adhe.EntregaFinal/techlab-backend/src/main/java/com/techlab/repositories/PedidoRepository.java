package com.techlab.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techlab.models.pedidos.Pedido;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
  List<Pedido> findByUsuarioId(Long usuarioId);

  // Logical-delete aware queries
  java.util.Optional<Pedido> findByIdAndDeletedFalse(Long id);

  java.util.List<Pedido> findByUsuarioIdAndDeletedFalse(Long usuarioId);

  java.util.List<Pedido> findAllByDeletedFalse();
}
