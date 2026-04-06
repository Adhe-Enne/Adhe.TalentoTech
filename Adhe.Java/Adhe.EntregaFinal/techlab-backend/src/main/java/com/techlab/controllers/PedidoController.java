package com.techlab.controllers;

import com.techlab.contracts.Result;
import com.techlab.contracts.DtoMapper;
import com.techlab.contracts.dtos.PedidoRequest;
import com.techlab.contracts.dtos.PedidoResponse;
import com.techlab.excepciones.BadRequestException;
import com.techlab.excepciones.ResourceNotFoundException;
import com.techlab.models.pedidos.Pedido;
import com.techlab.services.IPedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api")
public class PedidoController {

  private final IPedidoService pedidoService;

  public PedidoController(IPedidoService pedidoService) {
    this.pedidoService = pedidoService;
  }

  @Operation(summary = "Crear un nuevo pedido")
  @PostMapping("/pedidos")
  public ResponseEntity<Result<PedidoResponse>> crearPedido(@Valid @RequestBody PedidoRequest pedidoReq) {
    Pedido pedido = DtoMapper.fromRequest(pedidoReq);
    Pedido creado = pedidoService.crearPedido(pedido);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(Result.success("Pedido creado exitosamente", DtoMapper.toDto(creado)));
  }

  @Operation(summary = "Listar pedidos por ID de usuario")
  @GetMapping("/usuarios/{id}/pedidos")
  public ResponseEntity<Result<java.util.List<PedidoResponse>>> listarPorUsuario(@PathVariable("id") Long usuarioId) {
    if (usuarioId == null || usuarioId <= 0) {
      throw new BadRequestException("El ID de usuario no es válido.");
    }
    java.util.List<Pedido> pedidos = pedidoService.listarPedidosPorUsuario(usuarioId);
    if (pedidos.isEmpty()) {
      throw new ResourceNotFoundException("No se encontraron pedidos para el usuario con ID: " + usuarioId);
    }
    java.util.List<PedidoResponse> resp = pedidos.stream().map(DtoMapper::toDto).toList();
    return ResponseEntity.ok(Result.success(resp));
  }

  @Operation(summary = "Listar todos los pedidos")
  @GetMapping("/pedidos")
  public ResponseEntity<Result<java.util.List<PedidoResponse>>> listarPedidos() {
    java.util.List<Pedido> pedidos = pedidoService.listarPedidos();
    java.util.List<PedidoResponse> resp = pedidos.stream().map(DtoMapper::toDto).toList();
    return ResponseEntity.ok(Result.success(resp));
  }

  @Operation(summary = "Actualizar el estado de un pedido")
  @PutMapping("/pedidos/{id}/estado")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<PedidoResponse>> actualizarEstado(@PathVariable Long id,
      @RequestBody java.util.Map<String, String> body) {
    String estado = body.get("estado");
    Pedido actualizado = pedidoService.actualizarEstadoPedido(id, estado);
    return ResponseEntity.ok(Result.success("Estado actualizado exitosamente", DtoMapper.toDto(actualizado)));
  }

  @Operation(summary = "Eliminar físicamente un pedido")
  @DeleteMapping("/pedidos/{id}/fisico")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<Void>> eliminarPedidoFisico(@PathVariable Long id) {
    pedidoService.eliminarFisicamente(id);
    return ResponseEntity.ok(Result.success("Pedido eliminado físicamente", null));
  }

  @Operation(summary = "Eliminar lógicamente un pedido (alternativo)")
  @DeleteMapping("/pedidos/{id}/logico")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<Void>> eliminarPedidoLogico(@PathVariable Long id) {
    pedidoService.eliminarLogicamente(id);
    return ResponseEntity.ok(Result.success("Pedido eliminado lógicamente", null));
  }
}
