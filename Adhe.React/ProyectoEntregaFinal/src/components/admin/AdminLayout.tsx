import React from "react";
import { FaArrowLeft, FaBox, FaClipboardList, FaPlus, FaTachometerAlt, FaTicketAlt } from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";

import ExchangeRatesBanner from "../common/ExchangeRatesBanner";
import styles from "./AdminLayout.module.css";

const AdminLayout: React.FC = () => {
  return (
    <div className={styles.adminLayout}>
      <header className={styles.adminHeader}>
        <h2 className={styles.adminTitle}>Panel de Administración</h2>
        <NavLink aria-label="Volver a la tienda" className="btn btn-sm btn-outline-light" end to="/">
          <FaArrowLeft aria-hidden="true" className="me-1" />
          Volver a tienda
        </NavLink>
      </header>
      <ExchangeRatesBanner />
      <div className={styles.adminBody}>
        <nav aria-label="Panel de administración" className={styles.sidebar}>
          <NavLink aria-label="Dashboard" className={(props) => `${styles.sidebarLink}${props.isActive ? " " + styles.active : ""}`} end to="/admin">
            <FaTachometerAlt aria-hidden="true" className="me-1" />
            Dashboard
          </NavLink>
          <NavLink aria-label="Productos" className={(props) => `${styles.sidebarLink}${props.isActive ? " " + styles.active : ""}`} to="/admin/productos">
            <FaBox aria-hidden="true" className="me-1" />
            Productos
          </NavLink>
          <NavLink aria-label="Nuevo Producto" className={(props) => `${styles.sidebarLink}${props.isActive ? " " + styles.active : ""}`} to="/admin/productos/nuevo">
            <FaPlus aria-hidden="true" className="me-1" />
            Nuevo Producto
          </NavLink>
          <NavLink aria-label="Cupones" className={(props) => `${styles.sidebarLink}${props.isActive ? " " + styles.active : ""}`} to="/admin/cupones">
            <FaTicketAlt aria-hidden="true" className="me-1" />
            Cupones
          </NavLink>
          <NavLink aria-label="Pedidos" className={(props) => `${styles.sidebarLink}${props.isActive ? " " + styles.active : ""}`} to="/admin/ordenes">
            <FaClipboardList aria-hidden="true" className="me-1" />
            Pedidos
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
