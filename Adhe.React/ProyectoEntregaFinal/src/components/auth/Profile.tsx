import React from "react";

import type { UserInfo } from "../../services/authService";

import ConfirmDialog from "../ui/ConfirmDialog";

interface ProfileProps {
  user: UserInfo | null;
  onLogout: () => Promise<void>;
  onNavigateHome: () => void;
  showConfirm: boolean;
  onConfirmOpen: () => void;
  onConfirmClose: () => void;
  loggingOut: boolean;
}

const Profile: React.FC<ProfileProps> = (props) => {
  const { user, onLogout, showConfirm, onConfirmOpen, onConfirmClose, loggingOut, onNavigateHome } = props;

  const roleLabel: string = user?.rol === "admin" ? "Administrador" : "Usuario";

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: 460 }}>
        <div className="card-body p-4 text-center">
          <div
            className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 80, height: 80 }}
          >
            <span className="text-white fs-2 fw-bold">{user?.email?.charAt(0).toUpperCase() ?? "?"}</span>
          </div>
          <h4 className="mb-1">{user?.email ?? "Sin sesión"}</h4>
          <span className={`badge ${user?.rol === "admin" ? "bg-warning text-dark" : "bg-secondary"} mb-3`}>
            {roleLabel}
          </span>

          <hr />

          <div className="d-flex flex-column gap-2">
            <button
              className="btn btn-outline-danger"
              disabled={loggingOut}
              onClick={onConfirmOpen}
              type="button"
            >
              {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
            </button>
            <button className="btn btn-outline-secondary" onClick={onNavigateHome} type="button">
              Volver al inicio
            </button>
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
