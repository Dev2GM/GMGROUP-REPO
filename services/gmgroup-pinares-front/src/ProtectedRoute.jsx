// src/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const visitante = localStorage.getItem("visitante");

  if (!token && !visitante) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
