package com.techlab.security;

import com.techlab.models.usuarios.Usuario;
import com.techlab.repositories.UsuarioRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioDetailsService implements UserDetailsService {

  private final UsuarioRepository usuarioRepository;

  public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Usuario u = usuarioRepository.findByEmailAndDeletedFalse(username)
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
    return new UsuarioDetails(u);
  }
}
