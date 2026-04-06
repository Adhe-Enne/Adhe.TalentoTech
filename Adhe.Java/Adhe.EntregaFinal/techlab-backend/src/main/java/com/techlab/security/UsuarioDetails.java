package com.techlab.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.techlab.models.usuarios.Usuario;

import java.util.Collection;
import java.util.Collections;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UsuarioDetails implements UserDetails {

  private static final Logger logger = LoggerFactory.getLogger(UsuarioDetails.class);

  private final transient Usuario usuario;

  public UsuarioDetails(Usuario usuario) {
    this.usuario = usuario;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    String role = usuario.getRole();
    if (role == null || role.isBlank()) {
      logger.error("El usuario {} no tiene un rol asignado", usuario.getEmail());
      throw new IllegalStateException("El usuario no tiene un rol asignado");
    }
    return Collections.singletonList(new SimpleGrantedAuthority(role));
  }

  @Override
  public String getPassword() {
    return usuario.getPassword();
  }

  @Override
  public String getUsername() {
    return usuario.getEmail();
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return !Boolean.TRUE.equals(usuario.getDeleted());
  }
}
