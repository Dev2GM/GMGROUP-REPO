// src/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Swal from "sweetalert2";

export default function Register() {
  const [paisesOptions, setPaises] = useState([]);
  const [departamentosOptions, setDepartamentos] = useState([]);
  const [ciudadesOptions, setCiudades] = useState([]);
  const [dataLocation, setDataLocation] = useState([]);

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    genero: "",
    documento: "",
    email: "",
    telefono: "",
    usuario: "",
    contraseña: "",
    fecha_nacimiento: "",
    pais: "",
    departamento: "",
    ciudad: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const responseCLocation = await API.get("/api/location");
        if (responseCLocation.status === 200) {
          setDataLocation(responseCLocation.data);
        } else {
          setDataLocation([]);
        }
      } catch (error) {
        console.log(error);
        setDataLocation([]);
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    setPaises(
      dataLocation.map((p) => ({
        value: p.id,
        label: p.nombre,
      }))
    );
  }, [dataLocation]);

  useEffect(() => {
    const pais = dataLocation.find((p) => p.id === Number(formData.pais));
    const departamentos = pais?.departamentos ?? [];

    setDepartamentos(
      departamentos.map((p) => ({
        value: p.id,
        label: p.nombre,
      }))
    );
  }, [formData.pais]);

  useEffect(() => {
    const pais = dataLocation.find((p) => p.id === Number(formData.pais));
    const departamentos =
      pais?.departamentos.find((d) => d.id === Number(formData.departamento)) ??
      [];
    const ciudades = departamentos.ciudades ?? [];

    setCiudades(
      ciudades.map((p) => ({
        value: p.id,
        label: p.nombre,
      }))
    );
  }, [formData.departamento]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        username: formData.usuario,
        password: formData.contraseña,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        fecha_nacimiento: formData.fecha_nacimiento || null,
        telefono: formData.telefono || null,
        id_empresa: 1,
        persona: {
          tipo: "Fisica",
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          genero: formData.genero || null,
          documento: formData.documento,
          telefono: formData.telefono || null,
          direccion: null,
          email: formData.email,
          fecha_nacimiento: formData.fecha_nacimiento || null,
          id_corredor: null,
          id_ciudad: formData.ciudad ? Number(formData.ciudad) : null,
          es_cliente: true,
        },
      };

      const res = await API.post("/api/auth/register", payload);

      Swal.fire({
        icon: "success",
        title: "Registro exitoso 🎉",
        text: res.data.message || "Tu cuenta fue creada con éxito",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/");
      });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Error en registro";
      Swal.fire({
        icon: "error",
        title: "Oops... 😢",
        text: msg,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-5xl">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-4">
          Crear cuenta ✨
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Completa tus datos para registrarte
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="text-gray-700 text-sm font-medium">Nombres</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium">Apellidos</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium">Género</label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            >
              <option value="">Selecciona</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium">Documento</label>
            <input
              type="text"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium">Correo</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label htmlFor="telefono" className="text-gray-700 text-sm font-medium">Telefono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium">Usuario</label>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium">Contraseña</label>
            <input
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm font-medium">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* País */}
          <div>
            <label className="text-gray-700 text-sm font-medium">País</label>
            <select
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            >
              <option value="">Selecciona</option>
              {paisesOptions.map(p => {
                return <option key={p.value} value={p.value}>{p.label}</option>
              })}
            </select>
          </div>

          {/* Departamento */}
          <div>
            <label className="text-gray-700 text-sm font-medium">Departamento</label>
            <select
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            >
              <option value="">Selecciona</option>
              {departamentosOptions.map(p => {
                return <option key={p.value} value={p.value}>{p.label}</option>
              })}
            </select>
          </div>

          {/* Ciudad */}
          <div>
            <label className="text-gray-700 text-sm font-medium">Ciudad</label>
            <select
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            >
              <option value="">Selecciona</option>
              {ciudadesOptions.map(p => {
                return <option key={p.value} value={p.value}>{p.label}</option>
              })}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition"
            >
              Registrarse
            </button>
          </div>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          ¿Ya tienes cuenta?{" "}
          <a href="/" className="text-green-600 font-semibold hover:underline">
            Inicia sesión
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
