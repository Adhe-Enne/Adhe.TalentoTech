import React from "react";
import { FaArrowLeft, FaShoppingBag } from "react-icons/fa";
import { FaRightFromBracket } from "react-icons/fa6";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import type { UserInfo } from "../../../types/auth";

import ConfirmDialog from "../../ui/ConfirmDialog";
import HelmetMeta from "../../ui/HelmetMeta";

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
  const initials: string = user?.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="min-h-[70vh] flex justify-center px-4 py-12">
      <HelmetMeta description="Revisa tu perfil en Talento Tech." title="Talento Tech | Perfil" />

      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in">
          {/* Cover */}
          <div className="h-28 bg-gradient-to-br from-brand via-brand/90 to-accent" />

          {/* Avatar */}
          <div className="flex justify-center -mt-12">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-brand to-accent flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{initials}</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="text-center px-6 pt-3 pb-2">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{user?.email ?? "Sin sesión"}</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${user?.rol === "admin" ? "bg-warning/20 text-warning" : "bg-brand/10 text-brand"}`}>
              {roleLabel}
            </span>
          </div>

          {/* Divider */}
          <div className="px-6">
            <hr className="border-gray-100" />
          </div>

          {/* Actions */}
          <div className="px-6 py-4 flex flex-col gap-2">
            <button
              aria-label="Ver mis pedidos"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-brand bg-brand/5 hover:bg-brand/10 rounded-xl transition-colors"
              onClick={() => navigate("/mis-ordenes")}
              type="button"
            >
              <FaShoppingBag aria-hidden="true" className="w-4 h-4" />
              Mis pedidos
            </button>

            <button
              aria-label="Volver al inicio"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              onClick={() => navigate("/")}
              type="button"
            >
              <FaArrowLeft aria-hidden="true" className="w-4 h-4" />
              Volver al inicio
            </button>

            <button
              aria-label="Cerrar sesión"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-danger bg-danger/5 hover:bg-danger/10 rounded-xl disabled:opacity-50 transition-colors"
              disabled={loggingOut}
              onClick={onShowConfirm}
              type="button"
            >
              <FaRightFromBracket aria-hidden="true" className="w-4 h-4" />
              {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        confirmLabel="Cerrar sesión"
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
