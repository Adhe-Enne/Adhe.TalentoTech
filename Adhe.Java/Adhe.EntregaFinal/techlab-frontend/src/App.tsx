import React, { type JSX } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import AuthPage from './pages/AuthPage';
import ProductPage from './pages/ProductPage';
import StockManagementPage from './pages/StockManagementPage';
import CartPage from './pages/CartPage';
import DashboardPage from './pages/DashboardPage';

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route
        path="/stock-management"
        element={
          <PrivateRoute>
            <StockManagementPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
