package com.techlab.controllers;

import com.techlab.contracts.Result;
import com.techlab.contracts.DtoMapper;
import com.techlab.contracts.dtos.CategoriaDto;
import com.techlab.models.categorias.Categoria;
import com.techlab.services.ICategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

  private final ICategoriaService categoriaService;

  public CategoriaController(ICategoriaService categoriaService) {
    this.categoriaService = categoriaService;
  }

  @Operation(summary = "Listar todas las categorías", description = "Recupera la lista de todas las categorías del sistema.")
  @GetMapping
  public ResponseEntity<Result<java.util.List<CategoriaDto>>> listar() {
    java.util.List<Categoria> categorias = categoriaService.listarCategorias();
    java.util.List<CategoriaDto> dtos = categorias.stream().map(DtoMapper::toDto).toList();
    return ResponseEntity.ok(Result.success(dtos));
  }

  @Operation(summary = "Crear una nueva categoría", description = "Crea una nueva categoría proporcionando sus datos.")
  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<CategoriaDto>> crear(@Valid @RequestBody CategoriaDto categoriaDto) {
    Categoria c = DtoMapper.fromDto(categoriaDto);
    Categoria creado = categoriaService.crearCategoria(c);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(Result.success("Categoría creada exitosamente", DtoMapper.toDto(creado)));
  }

  @Operation(summary = "Obtener una categoría por ID", description = "Recupera una categoría por su ID único.")
  @GetMapping("/{id}")
  public ResponseEntity<Result<CategoriaDto>> obtener(@PathVariable Long id) {
    Categoria c = categoriaService.obtenerCategoriaPorId(id);
    return ResponseEntity.ok(Result.success(DtoMapper.toDto(c)));
  }

  @Operation(summary = "Actualizar una categoría por ID", description = "Actualiza los datos de una categoría existente por su ID.")
  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<CategoriaDto>> actualizar(@PathVariable Long id,
      @Valid @RequestBody CategoriaDto categoriaDto) {
    Categoria c = DtoMapper.fromDto(categoriaDto);
    Categoria actualizado = categoriaService.actualizarCategoria(id, c);
    return ResponseEntity.ok(Result.success("Categoría actualizada", DtoMapper.toDto(actualizado)));
  }

  @Operation(summary = "Eliminar físicamente una categoría por ID", description = "Eliminación permanente de una categoría (física).")
  @DeleteMapping("/{id}/fisico")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<Void>> eliminarFisico(@PathVariable Long id) {
    categoriaService.eliminarFisicamente(id);
    return ResponseEntity.ok(Result.success("Categoría eliminada físicamente", null));
  }

  @Operation(summary = "Eliminar lógicamente una categoría por ID (alternativo)")
  @DeleteMapping("/{id}/logico")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Result<Void>> eliminarLogico(@PathVariable Long id) {
    categoriaService.eliminarLogicamente(id);
    return ResponseEntity.ok(Result.success("Categoría eliminada lógicamente", null));
  }
}
