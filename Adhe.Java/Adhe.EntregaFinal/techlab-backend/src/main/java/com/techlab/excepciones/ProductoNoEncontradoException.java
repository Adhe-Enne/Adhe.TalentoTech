package com.techlab.excepciones;

public class ProductoNoEncontradoException extends RuntimeException {
  public ProductoNoEncontradoException(String message) {
    super(message);
  }
}
