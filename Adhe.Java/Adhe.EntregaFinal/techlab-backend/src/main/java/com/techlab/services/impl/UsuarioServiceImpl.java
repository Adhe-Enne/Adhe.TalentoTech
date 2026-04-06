package com.techlab.services.impl;

import com.techlab.models.usuarios.Usuario;
import com.techlab.repositories.UsuarioRepository;
import com.techlab.services.IUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.techlab.excepciones.BadRequestException;
import com.techlab.excepciones.ConflictException;
import com.techlab.excepciones.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.techlab.security.Roles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Pattern;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Collection;

@Service
public class UsuarioServiceImpl implements IUsuarioService {

  private static final String ROLE_ADMIN = "ADMIN";
  private static final String ROLE_USER = "USER";

  private final UsuarioRepository usuarioRepository;
  private final PasswordEncoder passwordEncoder;

  @Autowired
  public UsuarioServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
    this.usuarioRepository = usuarioRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public List<Usuario> listarUsuarios() {
    return usuarioRepository.findAllByDeletedFalse();
  }

  @Override
  public Usuario crearUsuario(Usuario usuario) {
    // Validaciones básicas
    if (usuario == null) {
      throw new BadRequestException("Usuario no puede ser nulo");
    }
    if (usuario.getNombre() == null || usuario.getNombre().trim().length() < 2
        || usuario.getNombre().trim().length() > 100) {
      throw new BadRequestException("Nombre inválido (2-100 caracteres)");
    }
    if (usuario.getEmail() == null || usuario.getEmail().trim().isEmpty()) {
      throw new BadRequestException("Email inválido");
    }
    String email = usuario.getEmail().trim();
    // Basic email pattern if DTO validation is bypassed
    Pattern emailPattern = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    if (!emailPattern.matcher(email).matches()) {
      throw new BadRequestException("Email con formato inválido");
    }
    // verificar email único (no eliminado)
    usuarioRepository.findByEmailAndDeletedFalse(email).ifPresent(u -> {
      throw new ConflictException("Email ya registrado: " + usuario.getEmail());
    });

    if (usuario.getPassword() == null || usuario.getPassword().length() < 6) {
      throw new BadRequestException("Password inválido: mínimo 6 caracteres");
    }

    // Normalize and validate role. Accept both 'ROLE_USER' and 'USER' formats.
    if (usuario.getRole() == null || usuario.getRole().trim().isEmpty()) {
      usuario.setRole(ROLE_USER);
    } else {
      String roleUpper = usuario.getRole().trim().toUpperCase();
      if (roleUpper.startsWith("ROLE_")) {
        roleUpper = roleUpper.substring(5);
      }
      if (!roleUpper.equals(ROLE_ADMIN) && !roleUpper.equals(ROLE_USER)) {
        throw new BadRequestException("Rol inválido: " + usuario.getRole());
      }
      usuario.setRole(roleUpper);
    }

    usuario.setDeleted(false);
    usuario.setDeletedAt(null);
    // Hash password before saving
    usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
    usuario.setEmail(email);
    return usuarioRepository.save(usuario);
  }

  @Override
  public Usuario obtenerUsuarioPorId(Long id) {
    return usuarioRepository.findByIdAndDeletedFalse(id)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
  }

  @Override
  public Usuario actualizarUsuario(Long id, Usuario usuario) {
    Usuario existente = usuarioRepository.findByIdAndDeletedFalse(id)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));

    if (usuario == null) {
      throw new BadRequestException("Usuario no puede ser nulo");
    }
    if (usuario.getNombre() != null) {
      if (usuario.getNombre().trim().length() < 2 || usuario.getNombre().trim().length() > 100) {
        throw new BadRequestException("Nombre inválido (2-100 caracteres)");
      }
      existente.setNombre(usuario.getNombre().trim());
    }
    if (usuario.getEmail() != null) {
      String email = usuario.getEmail().trim();
      Pattern emailPattern = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
      if (!emailPattern.matcher(email).matches()) {
        throw new BadRequestException("Email con formato inválido");
      }
      // check uniqueness
      usuarioRepository.findByEmailAndDeletedFalse(email).ifPresent(u -> {
        if (!u.getId().equals(id)) {
          throw new ConflictException("Email ya registrado: " + email);
        }
      });
      existente.setEmail(email);
    }
    if (usuario.getPassword() != null && usuario.getPassword().length() >= 6) {
      existente.setPassword(passwordEncoder.encode(usuario.getPassword()));
    }
    if (usuario.getRole() != null) {
      existente.setRole(usuario.getRole());
    }

    return usuarioRepository.save(existente);
  }

  @Override
  public Usuario eliminarLogicamente(Long id) {
    Usuario u = usuarioRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
    u.setDeleted(true);
    u.setDeletedAt(LocalDateTime.now());
    return usuarioRepository.save(u);
  }

  @Override
  public Usuario buscarPorEmail(String email) {
    return usuarioRepository.findByEmailAndDeletedFalse(email)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + email));
  }

  @Override
  public void eliminarFisicamente(Long id) {
    if (!usuarioRepository.existsById(id)) {
      throw new ResourceNotFoundException("Usuario no encontrado: " + id);
    }
    usuarioRepository.deleteById(id);
  }

  @Override
  public Usuario cambiarRolUsuario(Long id, String nuevoRol) {
    Usuario usuario = usuarioRepository.findByIdAndDeletedFalse(id)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));

    if (nuevoRol == null || nuevoRol.trim().isEmpty()) {
      throw new BadRequestException("El rol no puede ser nulo o vacío");
    }

    String rolUpper = nuevoRol.trim().toUpperCase();
    // Allow only known roles
    if (!rolUpper.equals(ROLE_ADMIN) && !rolUpper.equals(ROLE_USER)) {
      throw new BadRequestException("Rol inválido: " + nuevoRol);
    }

    // Prevent removing the last ADMIN
    String currentRole = usuario.getRole() == null ? "" : usuario.getRole().toUpperCase();
    if (currentRole.equals(ROLE_ADMIN) && !rolUpper.equals(ROLE_ADMIN)) {
      long adminCount = usuarioRepository.countByRoleAndDeletedFalse(ROLE_ADMIN);
      if (adminCount <= 1) {
        throw new BadRequestException("No se puede demotar al último administrador");
      }
    }

    usuario.setRole(rolUpper);
    return usuarioRepository.save(usuario);
  }

  @Override
  public Usuario actualizarContrasena(Long id, String currentPassword, String newPassword) {
    if (newPassword == null || newPassword.length() < 6) {
      throw new BadRequestException("La nueva contraseña debe tener al menos 6 caracteres");
    }

    Usuario usuario = usuarioRepository.findByIdAndDeletedFalse(id)
        .orElseThrow(() -> new com.techlab.excepciones.ResourceNotFoundException("Usuario no encontrado: " + id));

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String authName = auth == null ? null : auth.getName();
    boolean isAdmin = false;
    if (auth != null) {
      Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
      if (authorities != null) {
        for (GrantedAuthority ga : authorities) {
          if (ga.getAuthority() != null && ga.getAuthority().toUpperCase().contains("ADMIN")) {
            isAdmin = true;
            break;
          }
        }
      }
    }

    // If caller is not admin, ensure they are changing their own password and
    // provided current password
    if (!isAdmin) {
      if (authName == null || !authName.equals(usuario.getEmail())) {
        throw new BadRequestException("No autorizado para cambiar la contraseña de este usuario");
      }
      if (currentPassword == null || !passwordEncoder.matches(currentPassword, usuario.getPassword())) {
        throw new BadRequestException("Contraseña actual inválida");
      }
    }

    usuario.setPassword(passwordEncoder.encode(newPassword));
    usuario.setUpdatedAt(LocalDateTime.now());
    return usuarioRepository.save(usuario);
  }

  @Override
  public Usuario actualizarContrasenaPorAdmin(Long id, String newPassword) {
    if (newPassword == null || newPassword.length() < 6) {
      throw new BadRequestException("La nueva contraseña debe tener al menos 6 caracteres");
    }
    Usuario usuario = usuarioRepository.findByIdAndDeletedFalse(id)
        .orElseThrow(() -> new com.techlab.excepciones.ResourceNotFoundException("Usuario no encontrado: " + id));
    usuario.setPassword(passwordEncoder.encode(newPassword));
    usuario.setUpdatedAt(LocalDateTime.now());
    return usuarioRepository.save(usuario);
  }
}
