package com.techlab.services;

import java.util.List;

import com.techlab.models.usuarios.Usuario;

public interface IUsuarioService {
  Usuario crearUsuario(Usuario usuario);

  List<Usuario> listarUsuarios();

  Usuario obtenerUsuarioPorId(Long id);

  Usuario eliminarLogicamente(Long id);

  void eliminarFisicamente(Long id);

  Usuario actualizarUsuario(Long id, Usuario usuario);

  // Change password by user (requires current password unless caller is admin)
  Usuario actualizarContrasena(Long id, String currentPassword, String newPassword);

  // Admin override: change password without current password
  Usuario actualizarContrasenaPorAdmin(Long id, String newPassword);

  Usuario buscarPorEmail(String email);

  Usuario cambiarRolUsuario(Long id, String nuevoRol);
}
