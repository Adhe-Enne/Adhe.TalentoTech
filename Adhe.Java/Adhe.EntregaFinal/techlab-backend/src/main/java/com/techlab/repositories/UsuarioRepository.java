package com.techlab.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techlab.models.usuarios.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
  Optional<Usuario> findByIdAndDeletedFalse(Long id);

  Optional<Usuario> findByEmailAndDeletedFalse(String email);

  long countByRoleAndDeletedFalse(String role);

  java.util.List<Usuario> findAllByDeletedFalse();
}
