import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { handleChange } from "@/lib/utils";
import API from "@/api/api";

import type { Usuario } from "@/types/auth";

import { AxiosError } from "axios";
import Swal from "sweetalert2";


export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Usuario>({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    telefono: "",
    idEmpresa: 1
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire(
        "Las contraseñas no coinciden",
        "Necesitamos la confirmacion de tu contraseña para poder continuar",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/api/auth/register", {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        nombres: formData.nombre,
        apellidos: formData.apellido,
        telefono: formData.telefono,
        fecha_nacimiento: formData.fechaNacimiento,
        id_empresa: formData.idEmpresa
      })

      if (response.status == 200) {
        Swal.fire(
          "Usuario creado con exito",
          "Ya puedes ingresar con tu usuario y contraseña",
          "success"
        ).then(()=>{
          navigate("/login");
        });
      } else {
        Swal.fire(
          "Hubo un error",
          response.data.message,
          "error"
        )
      }
    } catch (error: unknown) {
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
          "Intentalo más tarde",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app min-h-screen flex flex-col justify-center items-center relative p-4 bg-gray-50">
      <div className="absolute top-8 left-8 w-40 h-40">
        <img src="/logo.svg" alt="Logo completo de +365 seguros" />
      </div>

      <div className="p-8 sm:p-10 max-w-4xl w-full bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <img
            src="/logo_reducido.svg"
            alt="Logo reducido de +365 seguros"
            className="mx-auto mb-4 w-24 h-24"
          />
          <h1 className="text-3xl font-bold">Regístrate</h1>
          <p className="text-gray-500">Completa tus datos para crear una cuenta</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Input
                label="Nombre"
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange(e, setFormData)}
                required
              />
            </div>

            <div>
              <Input
                label="Apellido"
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={(e) => handleChange(e, setFormData)}
                required
              />
            </div>

            <div>
              <Input
                label="Correo electrónico"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange(e, setFormData)}
                required
              />
            </div>

            <div>
              <Input
                label="Teléfono"
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={(e) => handleChange(e, setFormData)}
                required
              />
            </div>

            <div>
              <Input
                label="Fecha de nacimiento"
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={(e) => handleChange(e, setFormData)}
                required
              />
            </div>

            <div>
              <Input
                label="Usuario"
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={(e) => handleChange(e, setFormData)}
                required
              />
            </div>

            <div>
              <Input
                label="Contraseña"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleChange(e, setFormData)}
                required
              />
            </div>

            <div>
              <Input
                label="Confirmar ontraseña"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleChange(e, setFormData)}
                required
              />
            </div>
          </div>

          <div className="mt-8">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </div>

          <p className="mt-4 text-sm text-center">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-principal font-semibold hover:underline">
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}