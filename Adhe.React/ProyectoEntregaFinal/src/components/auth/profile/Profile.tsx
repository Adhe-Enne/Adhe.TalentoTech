import React, { useCallback, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import useAuth from "../../../hooks/selectors/useAuth";
import useNotification from "../../../hooks/selectors/useNotification";
import ProfileView from "./ProfileView";

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

  const handleNavigate: (path: string) => void = useCallback((path: string): void => {
    navigate(path);
  }, [navigate]);

  return <ProfileView loggingOut={loggingOut} onHideConfirm={() => setShowConfirm(false)} onLogout={handleLogout} onNavigate={handleNavigate} onShowConfirm={() => setShowConfirm(true)} showConfirm={showConfirm} user={user} />;
};

export default Profile;
