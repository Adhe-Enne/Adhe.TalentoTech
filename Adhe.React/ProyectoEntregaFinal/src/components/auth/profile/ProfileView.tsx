import React from "react";
import { Badge, Button } from "react-bootstrap";
import { FaShoppingBag } from "react-icons/fa";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { UserInfo } from "../../../types/auth";

import ConfirmDialog from "../../ui/ConfirmDialog";
import HelmetMeta from "../../ui/HelmetMeta";
import styles from "./Profile.module.css";

interface ProfileViewProps {
  loggingOut: boolean;
  showConfirm: boolean;
  user: UserInfo | null;
  onHideConfirm: () => void;
  onLogout: () => void;
  onShowConfirm: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = (props) => {
  const { loggingOut, onLogout, onShowConfirm, onHideConfirm, showConfirm, user } = props;
  const navigate: NavigateFunction = useNavigate();

  const roleLabel: string = user?.rol === "admin" ? "Administrador" : "Usuario";

  return (
    <div className={`d-flex justify-content-center align-items-center ${styles.profilePage}`}>
      <HelmetMeta description="Revisa tu perfil en Talento Tech." title="Talento Tech | Perfil" />
      <div className={`card shadow-sm ${styles.profileCard}`}>
        <div className="card-body p-4 text-center">
          <div className={`rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-3 ${styles.avatar}`}>
            <span className="text-white fs-2 fw-bold">{user?.email?.charAt(0).toUpperCase() ?? "?"}</span>
          </div>
          <h4 className="mb-1">{user?.email ?? "Sin sesión"}</h4>
          <Badge bg={user?.rol === "admin" ? "warning" : "secondary"} className={user?.rol === "admin" ? "text-dark mb-3" : "mb-3"}>
            {roleLabel}
          </Badge>

          <hr />

          <div className="d-flex flex-column gap-2">
            <Button aria-label="Mis pedidos" onClick={() => navigate("/mis-ordenes")} variant="outline-primary">
              <FaShoppingBag aria-hidden="true" className="me-1" />
              Mis pedidos
            </Button>
            <Button aria-label="Volver al inicio" onClick={() => navigate("/")} variant="outline-secondary">
              Volver al inicio
            </Button>
            <Button aria-label="Cerrar sesión" disabled={loggingOut} onClick={onShowConfirm} variant="outline-danger">
              {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        confirmLabel="Cerrar sesión"
        confirmVariant="danger"
        loading={loggingOut}
        loadingLabel="Cerrando sesión..."
        message="¿Estás seguro de que querés cerrar la sesión?"
        onCancel={onHideConfirm}
        onConfirm={onLogout}
        open={showConfirm}
        title="Cerrar sesión"
      />
    </div>
  );
};

export default ProfileView;
