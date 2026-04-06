package com.techlab.contracts;

import com.techlab.contracts.dtos.*;
import com.techlab.models.productos.Producto;
import com.techlab.models.categorias.Categoria;
import com.techlab.models.usuarios.Usuario;
import com.techlab.models.pedidos.LineaPedido;
import com.techlab.models.pedidos.Pedido;

import java.util.List;

public class DtoMapper {

  private DtoMapper() {
    // util class
  }

  // Producto
  public static ProductoDto toDto(Producto p) {
    if (p == null)
      return null;
    ProductoDto dto = new ProductoDto();
    dto.setId(p.getId());
    dto.setNombre(p.getNombre());
    dto.setDescripcion(p.getDescripcion());
    dto.setPrecio(p.getPrecio());
    dto.setStock(p.getStock());
    dto.setCategoriaId(p.getCategoriaId());
    dto.setImagenUrl(p.getImagenUrl());
    dto.setDeleted(p.getDeleted());
    dto.setDeletedAt(p.getDeletedAt());
    dto.setUpdatedAt(p.getUpdatedAt());
    return dto;
  }

  public static Producto fromDto(ProductoDto dto) {
    if (dto == null)
      return null;
    Producto p = new Producto();
    p.setId(dto.getId());
    p.setNombre(dto.getNombre() == null ? null : dto.getNombre().trim());
    p.setDescripcion(dto.getDescripcion() == null ? null : dto.getDescripcion().trim());
    p.setPrecio(dto.getPrecio());
    p.setStock(dto.getStock());
    p.setCategoriaId(dto.getCategoriaId());
    p.setImagenUrl(dto.getImagenUrl() == null ? null : dto.getImagenUrl().trim());
    // server controls deleted fields; ignore any incoming value
    return p;
  }

  // Categoria
  public static CategoriaDto toDto(Categoria c) {
    if (c == null)
      return null;
    CategoriaDto dto = new CategoriaDto();
    dto.setId(c.getId());
    dto.setNombre(c.getNombre());
    dto.setDescripcion(c.getDescripcion());
    dto.setActivo(c.isActivo());
    dto.setDeleted(c.getDeleted());
    dto.setDeletedAt(c.getDeletedAt());
    dto.setUpdatedAt(c.getUpdatedAt());
    return dto;
  }

  public static Categoria fromDto(CategoriaDto dto) {
    if (dto == null)
      return null;
    Categoria c = new Categoria();
    c.setId(dto.getId());
    c.setNombre(dto.getNombre() == null ? null : dto.getNombre().trim());
    c.setDescripcion(dto.getDescripcion() == null ? null : dto.getDescripcion().trim());
    c.setActivo(dto.isActivo());
    // server controls deleted fields; ignore dto.deleted
    return c;
  }

  // Usuario
  public static UsuarioResponse toDto(Usuario u) {
    if (u == null)
      return null;
    UsuarioResponse r = new UsuarioResponse();
    r.setId(u.getId());
    r.setNombre(u.getNombre());
    r.setEmail(u.getEmail());
    r.setDeleted(u.getDeleted());
    r.setDeletedAt(u.getDeletedAt());
    r.setRole(u.getRole());
    r.setUpdatedAt(u.getUpdatedAt());
    return r;
  }

  public static Usuario fromRequest(UsuarioRequest req) {
    if (req == null)
      return null;
    Usuario u = new Usuario();
    u.setNombre(req.getNombre() == null ? null : req.getNombre().trim());
    u.setEmail(req.getEmail() == null ? null : req.getEmail().trim());
    u.setPassword(req.getPassword());
    // set role: if provided use it, otherwise default to USER (service normalizes)
    if (req.getRole() != null && !req.getRole().trim().isEmpty()) {
      u.setRole(req.getRole().trim());
    } else {
      u.setRole("USER");
    }
    return u;
  }

  // Pedido / Lineas
  public static LineaPedidoResponse toDto(LineaPedido lp) {
    if (lp == null)
      return null;
    LineaPedidoResponse r = new LineaPedidoResponse();
    r.setId(lp.getId());
    r.setProductoId(lp.getProductoId());
    r.setCantidad(lp.getCantidad());
    r.setSubtotal(lp.getSubtotal());
    r.setDeleted(lp.getDeleted());
    r.setDeletedAt(lp.getDeletedAt());
    r.setUpdatedAt(lp.getUpdatedAt());
    return r;
  }

  public static LineaPedido fromRequest(LineaPedidoRequest req) {
    if (req == null)
      return null;
    LineaPedido lp = new LineaPedido();
    lp.setProductoId(req.getProductoId());
    lp.setCantidad(req.getCantidad());
    return lp;
  }

  public static PedidoResponse toDto(Pedido p) {
    if (p == null)
      return null;
    PedidoResponse r = new PedidoResponse();
    r.setId(p.getId());
    r.setUsuarioId(p.getUsuarioId());
    r.setEstado(p.getEstado());
    r.setFechaCreacion(p.getFechaCreacion());
    r.setTotal(p.getTotal());
    List<LineaPedidoResponse> lps = p.getLineasPedido() == null ? null
        : p.getLineasPedido().stream().map(DtoMapper::toDto).toList();
    r.setLineasPedido(lps);
    r.setDeleted(p.getDeleted());
    r.setDeletedAt(p.getDeletedAt());
    r.setUpdatedAt(p.getUpdatedAt());
    return r;
  }

  public static Pedido fromRequest(PedidoRequest req) {
    if (req == null)
      return null;
    Pedido p = new Pedido();
    p.setUsuarioId(req.getUsuarioId());
    if (req.getItemsPedido() != null) {
      List<LineaPedido> lps = req.getItemsPedido().stream().map(DtoMapper::fromRequest).toList();
      lps.forEach(lp -> lp.setPedido(p));
      p.setLineasPedido(lps);
    }
    return p;
  }
}
