// src/SelectLocation.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api";

export default function SelectLocation() {
  const navigate = useNavigate();
  const [paisesOptions, setPaises] = useState([]);
  const [departamentosOptions, setDepartamentos] = useState([]);
  const [ciudadesOptions, setCiudades] = useState([]);
  const [dataLocation, setDataLocation] = useState([]);
  const [formData, setFormData] = useState({
    pais: "",
    departamento: "",
    ciudad: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("visitante", JSON.stringify({...formData, isVisitor: true}));
    localStorage.removeItem("token")
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-xl font-bold mb-4">Entrar como visitante</h1>
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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded mt-4"
        >
          Entrar
        </button>
        <p className="text-center mt-4">
          ¿Ya tienes cuenta? <a href="/login" className="text-blue-600">Inicia sesión</a>
        </p>
        <p className="text-gray-500 text-sm text-center mt-6">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Regístrate
          </a>
        </p>
      </form>
    </div>
  );
}
