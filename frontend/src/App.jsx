import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Product from "./components/Product";
import Warehouse from "./components/Warehouse";
import Transaction from "./components/Transaction";
import Reports from "./components/Reports";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/product" element={
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        } />

        <Route path="/warehouse" element={
          <ProtectedRoute>
            <Warehouse />
          </ProtectedRoute>
        } />

        <Route path="/transaction" element={
          <ProtectedRoute>
            <Transaction />
          </ProtectedRoute>
        } />

        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />

      </Routes>

    </BrowserRouter>
  );
}

export default App;