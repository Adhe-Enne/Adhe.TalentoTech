package com.techlab.security;

import java.util.Arrays;

public enum Roles {
  ROLE_ADMIN, ROLE_USER;

  public static boolean isValid(String role) {
    return Arrays.stream(values()).anyMatch(r -> r.name().equals(role));
  }
}