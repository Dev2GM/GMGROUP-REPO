// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import SelectLocation from "./pages/SelectLocation";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login en la ruta raíz */}
        <Route path="/login" element={<Login />} />

        {/* Registro */}
        <Route path="/register" element={<Register />} />
        <Route path="/location" element={<SelectLocation />} />

        {/* Home protegido con JWT */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Cualquier ruta desconocida -> Login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
