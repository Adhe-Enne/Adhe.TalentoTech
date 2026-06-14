import React from "react";
import { Badge, Button } from "react-bootstrap";

import type { UserInfo } from "../../services/authService";

import ConfirmDialog from "../ui/ConfirmDialog";
import HelmetMeta from "../ui/HelmetMeta";

interface ProfileProps {
  loggingOut: boolean;
  showConfirm: boolean;
  user: UserInfo | null;
  onConfirmClose: () => void;
  onConfirmOpen: () => void;
  onLogout: () => Promise<void>;
  onNavigateHome: () => void;
}

const Profile: React.FC<ProfileProps> = (props) => {
  const { user, onLogout, showConfirm, onConfirmOpen, onConfirmClose, loggingOut, onNavigateHome } = props;

  const roleLabel: string = user?.rol === "admin" ? "Administrador" : "Usuario";

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <HelmetMeta description="Revisa tu perfil en Talento Tech." title="Talento Tech | Perfil" />
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: 460 }}>
        <div className="card-body p-4 text-center">
          <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 80, height: 80 }}>
            <span className="text-white fs-2 fw-bold">{user?.email?.charAt(0).toUpperCase() ?? "?"}</span>
          </div>
          <h4 className="mb-1">{user?.email ?? "Sin sesión"}</h4>
          <Badge bg={user?.rol === "admin" ? "warning" : "secondary"} className={user?.rol === "admin" ? "text-dark mb-3" : "mb-3"}>
            {roleLabel}
          </Badge>

          <hr />

          <div className="d-flex flex-column gap-2">
            <Button aria-label="Cerrar sesión" disabled={loggingOut} onClick={onConfirmOpen} variant="outline-danger">
              {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
            </Button>
            <Button aria-label="Volver al inicio" onClick={onNavigateHome} variant="outline-secondary">
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        confirmLabel="Cerrar sesión"
        confirmVariant="danger"
        loading={loggingOut}
        message="¿Estás seguro de que querés cerrar la sesión?"
        onCancel={onConfirmClose}
        onConfirm={onLogout}
        open={showConfirm}
        title="Cerrar sesión"
      />
    </div>
  );
};

export default Profile;
