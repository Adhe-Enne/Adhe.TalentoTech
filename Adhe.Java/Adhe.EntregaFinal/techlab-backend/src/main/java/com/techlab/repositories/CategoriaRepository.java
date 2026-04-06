package com.techlab.repositories;

import com.techlab.models.categorias.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

  boolean existsByNombre(String nombre);

  // Logical-delete aware queries
  java.util.Optional<Categoria> findByIdAndDeletedFalse(Long id);

  java.util.List<Categoria> findAllByDeletedFalse();

  boolean existsByNombreAndDeletedFalse(String nombre);

}
