// src/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Swal from "sweetalert2";

export default function Login() {
  const [username, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("visitante")

    try {
      const response = await API.post("/api/auth/login", {
        username,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);

        Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
          text: "Inicio de sesión exitoso 🎉",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error en la autenticación ❌",
          text: "No se pudo iniciar sesión",
        });
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      Swal.fire({
        icon: "warning",
        title: "Credenciales inválidas ⚠️",
        text: "Por favor revisa tu usuario y contraseña",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Bienvenido 👋
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Ingresa tus credenciales para continuar
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-700 text-sm font-medium">Usuario</label>
            <input
              type="text"
              placeholder="Tu usuario"
              value={username}
              onChange={(e) => setUsuario(e.target.value)}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition"
          >
            Ingresar
          </button>
        </form>

        {/* Extra */}
        <p className="text-gray-500 text-sm text-center mt-6">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Regístrate
          </a>
        </p>
        <p className="text-gray-500 text-sm text-center mt-6">
          Entrar como{" "}
          <a
            href="/location"
            className="text-blue-600 font-semibold hover:underline"
          >
            Invitado
          </a>
        </p>
      </div>
    </div>
  );
}
