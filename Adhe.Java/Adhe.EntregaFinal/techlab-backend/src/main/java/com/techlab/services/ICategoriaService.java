package com.techlab.services;

import com.techlab.models.categorias.Categoria;

import java.util.List;

public interface ICategoriaService {
  List<Categoria> listarCategorias();

  Categoria crearCategoria(Categoria categoria);

  Categoria obtenerCategoriaPorId(Long id);

  Categoria actualizarCategoria(Long id, Categoria categoria);

  // Physical delete (permanent)
  void eliminarFisicamente(Long id);

  // Logical delete (soft) -> returns updated entity
  Categoria eliminarLogicamente(Long id);

  // Backwards compatible alias (previous name)
  default void eliminarCategoria(Long id) {
    eliminarFisicamente(id);
  }
}
