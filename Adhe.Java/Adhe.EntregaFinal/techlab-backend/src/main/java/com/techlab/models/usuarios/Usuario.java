package com.techlab.models.usuarios;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import com.techlab.models.BaseEntity;

@Entity
public class Usuario extends BaseEntity {

  @NotNull
  @Size(min = 2, max = 100)
  private String nombre;

  @NotNull
  @Email
  @Size(max = 150)
  @Column(unique = true)
  private String email;

  @NotNull
  @Size(min = 6)
  private String password;

  @Column(nullable = false)
  private String role; // Stores the role of the user (e.g., ROLE_USER, ROLE_ADMIN)

  // Getters y setters

  public String getNombre() {
    return nombre;
  }

  public void setNombre(String nombre) {
    this.nombre = nombre;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }
}
