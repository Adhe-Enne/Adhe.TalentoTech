import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import styles from "./AdminLayout.module.css";

const AdminLayout: React.FC = () => {
  return (
    <div className={styles.adminLayout}>
      <header className={styles.adminHeader}>
        <h2 className={styles.adminTitle}>Panel de Administración</h2>
        <NavLink className="btn btn-sm btn-outline-light" end to="/">
          Volver a tienda
        </NavLink>
      </header>
      <div className={styles.adminBody}>
        <nav aria-label="Panel de administración" className={styles.sidebar}>
          <NavLink className={(props) => `${styles.sidebarLink}${props.isActive ? " " + styles.active : ""}`} end to="/admin">
            Dashboard
          </NavLink>
          <NavLink className={(props) => `${styles.sidebarLink}${props.isActive ? " " + styles.active : ""}`} to="/admin/productos">
            Productos
          </NavLink>
          <NavLink className={(props) => `${styles.sidebarLink}${props.isActive ? " " + styles.active : ""}`} to="/admin/productos/nuevo">
            + Nuevo Producto
          </NavLink>
          <NavLink className={(props) => `${styles.sidebarLink}${props.isActive ? " " + styles.active : ""}`} to="/admin/cupones">
            Cupones
          </NavLink>
        </nav>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
