package com.techlab.controllers;

import com.techlab.contracts.Result;
import com.techlab.contracts.DtoMapper;
import com.techlab.contracts.dtos.UsuarioRequest;
import com.techlab.contracts.dtos.UsuarioResponse;
import com.techlab.contracts.dtos.UsuarioPasswordUpdateRequest;
import com.techlab.contracts.dtos.AdminPasswordUpdateRequest;
import com.techlab.models.usuarios.Usuario;
import com.techlab.services.IUsuarioService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

  private final IUsuarioService usuarioService;

  public UsuarioController(IUsuarioService usuarioService) {
    this.usuarioService = usuarioService;
  }

  @Operation(summary = "Crear un nuevo usuario")
  @PostMapping
  public ResponseEntity<Result<UsuarioResponse>> crearUsuario(@Valid @RequestBody UsuarioRequest usuarioReq) {
    Usuario u = DtoMapper.fromRequest(usuarioReq);
    Usuario creado = usuarioService.crearUsuario(u);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(Result.success("Usuario creado exitosamente", DtoMapper.toDto(creado)));
  }

  @Operation(summary = "Listar todos los usuarios")
  @GetMapping
  public ResponseEntity<Result<java.util.List<UsuarioResponse>>> listarUsuarios() {
    java.util.List<Usuario> usuarios = usuarioService.listarUsuarios();
    java.util.List<UsuarioResponse> resp = usuarios.stream().map(DtoMapper::toDto).toList();
    return ResponseEntity.ok(Result.success(resp));
  }

  @Operation(summary = "Obtener un usuario por ID")
  @GetMapping("/{id}")
  public ResponseEntity<Result<UsuarioResponse>> obtenerUsuario(@PathVariable Long id) {
    Usuario usuario = usuarioService.obtenerUsuarioPorId(id);
    return ResponseEntity.ok(Result.success(DtoMapper.toDto(usuario)));
  }

  @Operation(summary = "Eliminar lógicamente un usuario por ID")
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<UsuarioResponse>> eliminarLogicamente(@PathVariable Long id) {
    Usuario usuario = usuarioService.eliminarLogicamente(id);
    return ResponseEntity.ok(Result.success("Usuario eliminado lógicamente", DtoMapper.toDto(usuario)));
  }

  @Operation(summary = "Eliminar físicamente un usuario por ID")
  @DeleteMapping("/{id}/fisico")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<Void>> eliminarFisicamente(@PathVariable Long id) {
    usuarioService.eliminarFisicamente(id);
    return ResponseEntity.ok(Result.success("Usuario eliminado físicamente", null));
  }

  @Operation(summary = "Eliminar lógicamente un usuario por ID (método alternativo)")
  @DeleteMapping("/{id}/logico")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<Void>> eliminarLogico(@PathVariable Long id) {
    usuarioService.eliminarLogicamente(id);
    return ResponseEntity.ok(Result.success("Usuario eliminado lógicamente", null));
  }

  @Operation(summary = "Actualizar un usuario por ID")
  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<UsuarioResponse>> actualizarUsuario(@PathVariable Long id,
      @Valid @RequestBody UsuarioRequest usuarioReq) {
    Usuario u = DtoMapper.fromRequest(usuarioReq);
    Usuario actualizado = usuarioService.actualizarUsuario(id, u);
    return ResponseEntity.ok(Result.success("Usuario actualizado exitosamente", DtoMapper.toDto(actualizado)));
  }

  @Operation(summary = "Buscar un usuario por email")
  @GetMapping("/buscar")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<UsuarioResponse>> buscarPorEmail(@RequestParam("email") String email) {
    Usuario u = usuarioService.buscarPorEmail(email);
    return ResponseEntity.ok(Result.success(DtoMapper.toDto(u)));
  }

  @Operation(summary = "Cambiar el rol de un usuario")
  @PutMapping("/{id}/role")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<UsuarioResponse>> cambiarRolUsuario(@PathVariable Long id,
      @RequestParam("role") String nuevoRol) {
    Usuario usuarioActualizado = usuarioService.cambiarRolUsuario(id, nuevoRol);
    return ResponseEntity
        .ok(Result.success("Rol del usuario actualizado exitosamente", DtoMapper.toDto(usuarioActualizado)));
  }

  @Operation(summary = "Cambiar contraseña propia (o por administrador)")
  @PutMapping("/{id}/password")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<Result<UsuarioResponse>> cambiarContrasena(@PathVariable Long id,
      @Valid @RequestBody UsuarioPasswordUpdateRequest req) {
    Usuario actualizado = usuarioService.actualizarContrasena(id, req.getCurrentPassword(), req.getNewPassword());
    return ResponseEntity.ok(Result.success("Contraseña actualizada", DtoMapper.toDto(actualizado)));
  }

  @Operation(summary = "Admin: cambiar contraseña de un usuario sin contraseña actual")
  @PutMapping("/{id}/password/admin")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<UsuarioResponse>> cambiarContrasenaPorAdmin(@PathVariable Long id,
      @Valid @RequestBody AdminPasswordUpdateRequest req) {
    Usuario actualizado = usuarioService.actualizarContrasenaPorAdmin(id, req.getNewPassword());
    return ResponseEntity.ok(Result.success("Contraseña actualizada por administrador", DtoMapper.toDto(actualizado)));
  }
}
