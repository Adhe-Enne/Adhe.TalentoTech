package com.techlab;

import java.util.Scanner;
import com.techlab.util.Console;
import com.techlab.managers.BusinessManager;

public class App {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        BusinessManager manager = new BusinessManager(scanner, true);
        Console.limpiarPantalla();

        int opcion;
        boolean menuActivo = true;

        while (menuActivo) {
            Console.imprimirSeparador();
            mostrarMenu();
            opcion = scanner.nextInt();
            Console.imprimirSeparador();
            Console.limpiarPantalla();

            switch (opcion) {
                case 1 -> manager.agregarProducto();
                case 2 -> manager.listarProductos();
                case 3 -> manager.buscarActualizarProducto();
                case 4 -> manager.eliminarProducto();
                case 5 -> manager.crearPedido();
                case 6 -> manager.listarPedidos();
                case 7 -> {
                    // Separador antes de salir
                    Console.imprimirEncabezado("Saliendo del sistema. ¡Hasta luego!");
                    menuActivo = false;
                }
                default -> {
                    Console.coutln("Opción inválida. Intente nuevamente.");
                    Console.imprimirSeparador();
                }
            }

            if (menuActivo)
                Console.limpiarPantalla();
        }
        scanner.close();
    }

    private static void mostrarMenu() {
        Console.fluent()
                .addLine(
                        "=================================== SISTEMA DE GESTIÓN - TECHLAB ==================================")
                .addLine("1) Agregar producto")
                .addLine("2) Listar productos")
                .addLine("3) Buscar/Actualizar producto")
                .addLine("4) Eliminar producto")
                .addLine("5) Crear un pedido")
                .addLine("6) Listar pedidos")
                .addLine("7) Salir")
                .addLine(
                        "==================================================================================================")
                .addLine("\nElija una opción: ");
    }
}
