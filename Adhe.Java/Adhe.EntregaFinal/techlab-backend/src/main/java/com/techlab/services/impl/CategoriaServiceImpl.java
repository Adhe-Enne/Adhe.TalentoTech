package com.techlab.services.impl;

import com.techlab.models.categorias.Categoria;
import com.techlab.repositories.CategoriaRepository;
import com.techlab.repositories.ProductoRepository;
import com.techlab.services.ICategoriaService;
import org.springframework.stereotype.Service;
import com.techlab.excepciones.BadRequestException;
import com.techlab.excepciones.ConflictException;
import com.techlab.excepciones.ResourceNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaServiceImpl implements ICategoriaService {

  private final CategoriaRepository categoriaRepository;
  private final ProductoRepository productoRepository;

  public CategoriaServiceImpl(CategoriaRepository categoriaRepository, ProductoRepository productoRepository) {
    this.categoriaRepository = categoriaRepository;
    this.productoRepository = productoRepository;
  }

  @Override
  public List<Categoria> listarCategorias() {
    return categoriaRepository.findAllByDeletedFalse();
  }

  @Override
  @Transactional
  public Categoria crearCategoria(Categoria categoria) {
    validateCategoria(categoria);
    // Ensure logical-delete defaults
    categoria.setDeleted(false);
    categoria.setDeletedAt(null);
    return categoriaRepository.save(categoria);
  }

  @Override
  public Categoria obtenerCategoriaPorId(Long id) {
    return categoriaRepository.findByIdAndDeletedFalse(id)
        .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada: " + id));
  }

  @Override
  @Transactional
  public Categoria actualizarCategoria(Long id, Categoria categoria) {
    Categoria existente = obtenerCategoriaPorId(id);
    existente.setNombre(categoria.getNombre());
    existente.setDescripcion(categoria.getDescripcion());
    existente.setActivo(categoria.isActivo());
    return categoriaRepository.save(existente);
  }

  @Override
  @Transactional
  public void eliminarCategoria(Long id) {
    // Keep backward compatibility: perform physical delete
    eliminarFisicamente(id);
  }

  @Override
  @Transactional
  public void eliminarFisicamente(Long id) {
    // Prevenir eliminación si hay productos asociados
    boolean tieneProductos = productoRepository.existsByCategoriaId(id);
    if (tieneProductos) {
      throw new ConflictException("No se puede eliminar la categoría porque tiene productos asociados");
    }
    categoriaRepository.deleteById(id);
  }

  @Override
  @Transactional
  public Categoria eliminarLogicamente(Long id) {
    Categoria c = categoriaRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada: " + id));
    // Prevent logical delete if there are products associated
    boolean tieneProductos = productoRepository.existsByCategoriaId(id);
    if (tieneProductos) {
      throw new ConflictException("No se puede eliminar lógicamente la categoría porque tiene productos asociados");
    }
    c.setDeleted(true);
    c.setDeletedAt(java.time.LocalDateTime.now());
    return categoriaRepository.save(c);
  }

  private void validateCategoria(Categoria categoria) {
    if (categoria == null)
      throw new BadRequestException("Categoría no puede ser nula");
    String nombre = categoria.getNombre() == null ? null : categoria.getNombre().trim();
    if (nombre == null || nombre.length() < 2 || nombre.length() > 100) {
      throw new BadRequestException("Nombre de categoría inválido (2-100 caracteres)");
    }
    if (categoria.getDescripcion() != null && categoria.getDescripcion().length() > 255) {
      throw new BadRequestException("Descripción no puede exceder 255 caracteres");
    }
    if (categoriaRepository.existsByNombre(categoria.getNombre())) {
      throw new ConflictException("Ya existe una categoría con el nombre: " + categoria.getNombre());
    }
  }
}
