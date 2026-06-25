import React, { useCallback, useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { FaShoppingBag } from "react-icons/fa";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import useAuth from "../../../hooks/selectors/useAuth";
import useNotification from "../../../hooks/selectors/useNotification";
import ConfirmDialog from "../../ui/ConfirmDialog";
import HelmetMeta from "../../ui/HelmetMeta";
import styles from "./Profile.module.css";

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  const handleLogout: () => Promise<void> = useCallback(async () => {
    setShowConfirm(false);
    setLoggingOut(true);
    try {
      await logout();
      setNotification("Sesión cerrada", 3000, "info");
      navigate("/login");
    } catch {
      setNotification("Error al cerrar sesión", 3000, "danger");
    } finally {
      setLoggingOut(false);
    }
  }, [logout, navigate, setNotification]);

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
            <Button aria-label="Cerrar sesión" disabled={loggingOut} onClick={() => setShowConfirm(true)} variant="outline-danger">
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
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleLogout}
        open={showConfirm}
        title="Cerrar sesión"
      />
    </div>
  );
};

export default Profile;
