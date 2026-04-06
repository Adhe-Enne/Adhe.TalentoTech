package com.techlab.excepciones;

public class ConflictException extends RuntimeException {
  public ConflictException(String message) {
    super(message);
  }
}
