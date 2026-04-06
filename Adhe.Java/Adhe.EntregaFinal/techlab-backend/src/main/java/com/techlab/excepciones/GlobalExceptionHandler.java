package com.techlab.excepciones;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

  // Keys
  static String timestamp = "timestamp";
  static String status = "status";
  static String error = "error";
  static String errors = "errors";
  static String message = "message";
  static String path = "path";

  // Values
  static String badRequest = "Bad Request";
  static String notFound = "Not Found";

  @ExceptionHandler(ProductoNoEncontradoException.class)
  public ResponseEntity<Map<String, Object>> handleProductoNotFound(ProductoNoEncontradoException ex,
      HttpServletRequest request) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put(timestamp, Instant.now().toString());
    body.put(status, HttpStatus.NOT_FOUND.value());
    body.put(error, notFound);
    body.put(message, ex.getMessage());
    body.put(path, request.getRequestURI());
    return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(StockInsuficienteException.class)
  public ResponseEntity<Map<String, Object>> handleStockInsuficiente(StockInsuficienteException ex,
      HttpServletRequest request) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put(timestamp, Instant.now().toString());
    body.put(status, HttpStatus.BAD_REQUEST.value());
    body.put(error, badRequest);
    body.put(message, ex.getMessage());
    body.put(path, request.getRequestURI());
    return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex,
      HttpServletRequest request) {
    List<String> errorsResult = ex.getBindingResult()
        .getFieldErrors()
        .stream()
        .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
        .toList();

    Map<String, Object> body = new LinkedHashMap<>();
    body.put(timestamp, Instant.now().toString());
    body.put(status, HttpStatus.BAD_REQUEST.value());
    body.put(error, badRequest);
    body.put(message, "Validation failed");
    body.put(errors, errorsResult);
    body.put(path, request.getRequestURI());
    return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
  public ResponseEntity<Map<String, Object>> handleAuthentication(
      org.springframework.security.core.AuthenticationException ex,
      HttpServletRequest request) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put(timestamp, Instant.now().toString());
    body.put(status, HttpStatus.UNAUTHORIZED.value());
    body.put(error, "Unauthorized");
    body.put(message, ex.getMessage());
    body.put(path, request.getRequestURI());
    return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(com.techlab.excepciones.ResourceNotFoundException.class)
  public ResponseEntity<Map<String, Object>> handleResourceNotFound(
      com.techlab.excepciones.ResourceNotFoundException ex,
      HttpServletRequest request) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put(timestamp, Instant.now().toString());
    body.put(status, HttpStatus.NOT_FOUND.value());
    body.put(error, notFound);
    body.put(message, ex.getMessage());
    body.put(path, request.getRequestURI());
    return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex, HttpServletRequest request) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put(timestamp, Instant.now().toString());
    body.put(status, HttpStatus.INTERNAL_SERVER_ERROR.value());
    body.put(error, "Internal Server Error");
    body.put(message, "Unexpected error");
    body.put(path, request.getRequestURI());
    return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(com.techlab.excepciones.BadRequestException.class)
  public ResponseEntity<Map<String, Object>> handleBadRequest(com.techlab.excepciones.BadRequestException ex,
      HttpServletRequest request) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put(timestamp, Instant.now().toString());
    body.put(status, HttpStatus.BAD_REQUEST.value());
    body.put(error, "Bad Request");
    body.put(message, ex.getMessage());
    body.put(path, request.getRequestURI());
    return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(com.techlab.excepciones.ConflictException.class)
  public ResponseEntity<Map<String, Object>> handleConflict(com.techlab.excepciones.ConflictException ex,
      HttpServletRequest request) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put(timestamp, Instant.now().toString());
    body.put(status, HttpStatus.CONFLICT.value());
    body.put(error, "Conflict");
    body.put(message, ex.getMessage());
    body.put(path, request.getRequestURI());
    return new ResponseEntity<>(body, HttpStatus.CONFLICT);
  }
}
