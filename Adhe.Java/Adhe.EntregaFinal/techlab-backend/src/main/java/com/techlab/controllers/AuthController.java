package com.techlab.controllers;

import com.techlab.contracts.AuthRequest;
import com.techlab.contracts.Result;
import com.techlab.contracts.DtoMapper;
import com.techlab.contracts.dtos.UsuarioRequest;
import com.techlab.contracts.dtos.UsuarioResponse;
import com.techlab.models.usuarios.Usuario;
import com.techlab.security.JwtUtil;
import com.techlab.services.IUsuarioService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final JwtUtil jwtUtil;
  private final UserDetailsService userDetailsService;
  private final IUsuarioService usuarioService;

  public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil,
      UserDetailsService userDetailsService, IUsuarioService usuarioService) {
    this.authenticationManager = authenticationManager;
    this.jwtUtil = jwtUtil;
    this.userDetailsService = userDetailsService;
    this.usuarioService = usuarioService;
  }

  @Operation(summary = "Authenticate user and generate JWT token")
  @PostMapping("/login")
  public ResponseEntity<Result<String>> login(@Valid @RequestBody AuthRequest req) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
    final UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
    // Include user's authorities (roles) in the generated token
    final String token = jwtUtil.generateToken(userDetails.getUsername(), userDetails.getAuthorities());
    return ResponseEntity.ok(Result.success("Login exitoso", token));
  }

  @Operation(summary = "Register a new user")
  @PostMapping("/register")
  public ResponseEntity<Result<UsuarioResponse>> register(@Valid @RequestBody UsuarioRequest usuarioReq) {
    Usuario u = DtoMapper.fromRequest(usuarioReq);
    Usuario created = usuarioService.crearUsuario(u);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(Result.success("Usuario registrado exitosamente", DtoMapper.toDto(created)));
  }
}
