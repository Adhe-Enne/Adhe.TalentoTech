package com.techlab.contracts.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AdminPasswordUpdateRequest {

  @NotBlank(message = "La nueva contraseña es requerida")
  @Size(min = 6, message = "La nueva contraseña debe tener al menos 6 caracteres")
  private String newPassword;

  public String getNewPassword() {
    return newPassword;
  }

  public void setNewPassword(String newPassword) {
    this.newPassword = newPassword;
  }
}
