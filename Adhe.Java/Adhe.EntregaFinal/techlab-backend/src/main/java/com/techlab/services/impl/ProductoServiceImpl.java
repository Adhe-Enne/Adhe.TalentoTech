package com.techlab.services.impl;

import com.techlab.repositories.ProductoRepository;
import com.techlab.repositories.CategoriaRepository;
import com.techlab.services.IProductoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.techlab.excepciones.ResourceNotFoundException;
import com.techlab.models.productos.Producto;
import com.techlab.excepciones.BadRequestException;
import java.util.regex.Pattern;

import java.util.List;

@Service
@Transactional
public class ProductoServiceImpl implements IProductoService {

  private final ProductoRepository productoRepository;
  private final CategoriaRepository categoriaRepository;

  public ProductoServiceImpl(ProductoRepository productoRepository, CategoriaRepository categoriaRepository) {
    this.productoRepository = productoRepository;
    this.categoriaRepository = categoriaRepository;
  }

  @Override
  public List<Producto> listarProductos() {
    return productoRepository.findAllByDeletedFalse();
  }

  @Override
  public Producto obtenerProductoPorId(Long id) {
    return productoRepository.findByIdAndDeletedFalse(id)
        .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
  }

  @Override
  public Producto crearProducto(Producto producto) {
    validateProducto(producto);
    producto.setId(null);
    producto.setDeleted(false);
    producto.setDeletedAt(null);
    return productoRepository.save(producto);
  }

  @Override
  public Producto actualizarProducto(Long id, Producto producto) {
    Producto existente = productoRepository.findByIdAndDeletedFalse(id)
        .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
    validateProducto(producto);
    existente.setNombre(producto.getNombre());
    existente.setDescripcion(producto.getDescripcion());
    existente.setPrecio(producto.getPrecio());
    existente.setStock(producto.getStock());
    existente.setCategoriaId(producto.getCategoriaId());
    existente.setImagenUrl(producto.getImagenUrl());
    return productoRepository.save(existente);
  }

  private void validateProducto(Producto producto) {
    if (producto == null) {
      throw new BadRequestException("Producto no puede ser nulo");
    }
    String nombre = producto.getNombre() == null ? null : producto.getNombre().trim();
    if (nombre == null || nombre.length() < 2 || nombre.length() > 100) {
      throw new BadRequestException("Nombre de producto inválido (2-100 caracteres)");
    }
    if (producto.getPrecio() == null || producto.getPrecio() <= 0 || !Double.isFinite(producto.getPrecio())) {
      throw new BadRequestException("Precio inválido. Debe ser un número mayor que 0");
    }
    if (producto.getStock() == null || producto.getStock() < 0) {
      throw new BadRequestException("Stock inválido. No puede ser negativo");
    }
    if (producto.getCategoriaId() == null) {
      throw new BadRequestException("El ID de la categoría no puede ser nulo");
    }

    // Verificar que la categoría exista en la base de datos
    boolean exists = categoriaRepository.existsById(producto.getCategoriaId());
    if (!exists) {
      throw new BadRequestException("La categoría con ID " + producto.getCategoriaId() + " no existe.");
    }
    if (producto.getImagenUrl() != null) {
      String url = producto.getImagenUrl().trim();
      if (url.length() > 255) {
        throw new BadRequestException("La URL de la imagen no puede exceder 255 caracteres");
      }
      // Simple URL validation (acepta http/https)
      Pattern urlPattern = Pattern.compile("^(https?)://.+", Pattern.CASE_INSENSITIVE);
      if (!urlPattern.matcher(url).matches()) {
        throw new BadRequestException("imagenUrl debe ser una URL válida que comience con http:// o https://");
      }
    }
  }

  @Override
  public void eliminarProducto(Long id) {
    // backward compatible alias -> physical delete
    eliminarFisicamente(id);
  }

  @Override
  public void eliminarFisicamente(Long id) {
    if (!productoRepository.existsById(id)) {
      throw new ResourceNotFoundException("Producto no encontrado");
    }
    productoRepository.deleteById(id);
  }

  @Override
  public Producto eliminarLogicamente(Long id) {
    Producto p = productoRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
    p.setDeleted(true);
    p.setDeletedAt(java.time.LocalDateTime.now());
    return productoRepository.save(p);
  }

  @Override
  public java.util.List<Producto> buscarPorNombre(String nombre) {
    if (nombre == null || nombre.trim().isEmpty()) {
      return productoRepository.findAllByDeletedFalse();
    }
    return productoRepository.findByNombreContainingIgnoreCaseAndDeletedFalse(nombre.trim());
  }

  @Override
  public java.util.List<Producto> listarPorCategoria(Long categoriaId) {
    if (categoriaId == null) {
      throw new BadRequestException("categoriaId es requerido");
    }
    return productoRepository.findByCategoriaIdAndDeletedFalse(categoriaId);
  }
}
