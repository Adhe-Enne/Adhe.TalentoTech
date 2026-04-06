import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardPage(): React.JSX.Element {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ padding: 24, background: '#ffffff', borderRadius: 8, boxShadow: '0 6px 18px rgba(15,23,42,0.08)' }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Dashboard</h2>
        <p style={{ marginTop: 8 }}>Elige una acción rápida:</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <Link
            to="/products"
            style={{
              padding: '8px 12px',
              background: '#0ea5a4',
              color: '#fff',
              borderRadius: 6,
              textDecoration: 'none',
            }}
          >
            Ver Productos
          </Link>
          <Link
            to="/cart"
            style={{
              padding: '8px 12px',
              background: '#0891b2',
              color: '#fff',
              borderRadius: 6,
              textDecoration: 'none',
            }}
          >
            Ver Carrito
          </Link>
          <Link
            to="/stock-management"
            style={{
              padding: '8px 12px',
              background: '#2563eb',
              color: '#fff',
              borderRadius: 6,
              textDecoration: 'none',
            }}
          >
            Gestionar Stock
          </Link>
        </div>
      </div>
    </div>
  );
}
