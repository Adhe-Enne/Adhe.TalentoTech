import React from "react";
import { FaArrowLeft, FaBox, FaClipboardList, FaPlus, FaTachometerAlt, FaTicketAlt } from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";

import ExchangeRatesBanner from "../common/ExchangeRatesBanner";

const sidebarLink: (isActive: boolean) => string = (isActive: boolean): string =>
  `relative flex items-center px-5 py-2.5 text-sm no-underline min-h-[44px] transition-all duration-150 border-l-2 max-md:border-l-0 max-md:border-b-2 ${
    isActive ? "font-semibold text-white bg-white/10 border-warning max-md:border-warning" : "text-gray-300 hover:bg-white/5 hover:text-white border-transparent hover:border-white/20 max-md:border-transparent"
  }`;

const AdminLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-gray-900">
        <h2 className="m-0 text-xl font-semibold text-white">Panel de Administración</h2>
        <NavLink aria-label="Volver a la tienda" className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-white/20 inline-flex items-center gap-1 transition-colors" end to="/">
          <FaArrowLeft aria-hidden="true" />
          Volver a tienda
        </NavLink>
      </header>
      <ExchangeRatesBanner showRefresh />
      <div className="flex flex-1 max-md:flex-col">
        <nav
          aria-label="Panel de administración"
          className="w-[220px] shrink-0 bg-gray-900 border-r border-white/10 py-4 flex flex-col gap-1 max-md:w-full max-md:flex-row max-md:overflow-x-auto max-md:border-r-0 max-md:border-b max-md:border-white/10 max-md:p-2 max-md:gap-0"
        >
          <NavLink aria-label="Dashboard" className={({ isActive }: { isActive: boolean }) => sidebarLink(isActive)} end to="/admin">
            <FaTachometerAlt aria-hidden="true" className="mr-2 shrink-0" />
            Dashboard
          </NavLink>
          <NavLink aria-label="Productos" className={({ isActive }: { isActive: boolean }) => sidebarLink(isActive)} to="/admin/productos">
            <FaBox aria-hidden="true" className="mr-2 shrink-0" />
            Productos
          </NavLink>
          <NavLink aria-label="Nuevo Producto" className={({ isActive }: { isActive: boolean }) => sidebarLink(isActive)} to="/admin/productos/nuevo">
            <FaPlus aria-hidden="true" className="mr-2 shrink-0" />
            Nuevo Producto
          </NavLink>
          <NavLink aria-label="Cupones" className={({ isActive }: { isActive: boolean }) => sidebarLink(isActive)} to="/admin/cupones">
            <FaTicketAlt aria-hidden="true" className="mr-2 shrink-0" />
            Cupones
          </NavLink>
          <NavLink aria-label="Pedidos" className={({ isActive }: { isActive: boolean }) => sidebarLink(isActive)} to="/admin/ordenes">
            <FaClipboardList aria-hidden="true" className="mr-2 shrink-0" />
            Pedidos
          </NavLink>
        </nav>
        <main className="flex-1 p-6 bg-gray-50 min-w-0 max-md:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
