import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { handleChange } from "@/lib/utils";
import API from "@/api/api";

import type { Usuario } from "@/types/auth";

import Swal from "sweetalert2";
import { AxiosError } from "axios";


export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Usuario>({ 
    username: "", 
    password: "" 
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("/api/auth/login", {
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 200) {
        login(response.data.token);
        navigate("/buscador");
      } else {
        Swal.fire(
          "Hubo un error",
          response.data.message,
          "error"
        )
      }
    } catch (error: unknown) {
      console.error("Error completo:", error);
      if (error instanceof AxiosError) {
        if (error.response?.data?.message) {
          Swal.fire(
            "Hubo un error",
            error.response.data.message,
            "error"
          )
        } else {
          Swal.fire(
            "Hubo un error",
            "Hubo un error en el servidor, intentalo más tarde",
            "error"
          )
        }
      } else {
        Swal.fire(
          "Hubo un error",
          "Hubo un error, intentalo más tarde",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app min-h-screen flex flex-col justify-center items-center relative p-4">
      <div className="absolute top-8 left-8 w-40 h-40">
        <img src="/logo.svg" alt="Logo completo de +365 seguros" />
      </div>

      <div className="p-8 text-center max-w-md w-full bg-white rounded-lg shadow-md">
        <img
          src="/logo_reducido.svg"
          alt="Logo reducido de +365 seguros"
          className="mx-auto mb-6 w-32 h-32"
        />
        <h1 className="text-3xl font-bold mb-2">Iniciar sesión</h1>
        <p className="mb-8">Inicia sesión y empieza a revisar tus finanzas</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Usuario"
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={(e) => handleChange(e, setFormData)}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleChange(e, setFormData)}
            required
          />

          <div className="text-right text-sm">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </Button>
        </form>

        <p className="mt-8 text-sm">
          ¿No tienes una cuenta?{" "}
          <strong>
            <a href="/register" className="text-principal hover:text-principal/80 font-semibold">
              Regístrate
            </a>
          </strong>
        </p>
      </div>
    </div>
  );
}
