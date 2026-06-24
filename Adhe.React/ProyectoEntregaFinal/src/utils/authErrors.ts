export function translateAuthError(error: unknown): string {
  if (error instanceof Error) {
    const code: string = (error as { code?: string }).code ?? "";
    switch (code) {
      case "auth/email-already-in-use":
        return "Este correo electrónico ya está registrado";
      case "auth/user-not-found":
        return "Usuario no encontrado";
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Correo electrónico o contraseña incorrectos";
      case "auth/invalid-email":
        return "Correo electrónico inválido";
      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres";
      case "auth/too-many-requests":
        return "Demasiados intentos. Intentá de nuevo más tarde";
      case "auth/network-request-failed":
        return "Error de conexión. Verificá tu internet";
      default:
        return error.message;
    }
  }
  return "Error desconocido";
}
