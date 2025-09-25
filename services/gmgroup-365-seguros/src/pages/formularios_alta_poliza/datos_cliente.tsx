import { useState, useEffect } from "react";
import API from "@/api/api";
import Swal from "sweetalert2";

interface DatosClienteProps {
  formData: {
    id_persona?: string;
    cedula: string;
    nombre: string;
    apellido?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    fecha_nacimiento?: string;
    id_pais?: string;
    id_departamento?: string | undefined;
    id_ciudad?: string | undefined;
    tipo_persona?: string;
  };
  datosBasicos: {
    corredorSeguros: string;
  };
  onDataChange: (data: any) => void;
}

function DatosCliente({
  formData,
  datosBasicos,
  onDataChange,
}: DatosClienteProps) {
  const [clienteEncontrado, setClienteEncontrado] = useState(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState<any[]>([]);
  const [paises, setPaises] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [ciudades, setCiudades] = useState<any[]>([]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await API.get("/api/location", {
          headers: {
            "Authorization" : `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        if (response.status === 200) {
          // aqui parsear la data recibida
          setPaises(
              response.data.map((p: { id: number; nombre: string }) => ({
                  value: p.id,
                  label: p.nombre
              }))
          );

          setLocation(response.data)
        } else {
          console.error("Error al obtener corredores:");
        }
      } catch {
        console.error("Error al obtener corredores:");
      }
    };

    fetchLocation();
  }, []);

  // Cargar departamentos al montar
  useEffect(() => {
    const pais = location.find((p: any) => p.id === Number(formData.id_pais));
    const departamentos = pais?.departamentos ?? [];

    setDepartamentos(
        departamentos.map((p: { id: number; nombre: string }) => ({
            value: p.id,
            label: p.nombre
        }))
    );
  }, [formData.id_pais]);

  // Cargar ciudades cuando cambia el departamento
  useEffect(() => {
    const pais = location.find((p: any) => p.id === Number(formData.id_pais));
    const departamentos = pais?.departamentos.find((d: any) => d.id === Number(formData.id_departamento)) ?? [];
    const ciudades = departamentos.ciudades ?? [];

    setCiudades(
        ciudades.map((p: { id: number; nombre: string }) => ({
            value: p.id,
            label: p.nombre
        }))
    );
  }, [formData.id_departamento]);

  const handleInputChange = (name: string, value: string) => {
    const newFormData = {
      ...formData,
      [name]: value,
    };

    // Si cambia el departamento, limpiar la ciudad
    if (name === "id_departamento") {
      newFormData.id_ciudad = "";
    }

    onDataChange(newFormData);
  };

  const buscarCliente = async () => {
    if (!formData.cedula.trim()) {
      setError("Debe ingresar una cédula para buscar");
      return;
    }

    if (!datosBasicos?.corredorSeguros) {
      setError("Debe seleccionar un corredor primero");
      return;
    }

    setIsLoading(true);
    setError("");
    setShowResults(false);
    setClienteEncontrado(null);

    try {
      const response = await API.get("/api/personas/filtrar?cedula=" + formData.cedula.trim() + "&id_corredor=" + datosBasicos.corredorSeguros)

      if (response.status === 404) {
        Swal.fire(
          "No encontrado",
          "No se encontró una persona con esos datos.",
          "info"
        );
        setIsLoading(false);
        return;
      }

      if (response.status === 200) {
        const persona = response.data
        setClienteEncontrado(persona);
        onDataChange({
          ...formData,
          id_persona: persona.id,
          nombre: persona.nombres || "",
          apellido: persona.apellidos || "",
          telefono: persona.telefono || "",
          email: persona.email || "",
          direccion: persona.direccion || "",
          fecha_nacimiento: persona.fecha_nacimiento?.split("T")[0] || "",
          id_pais: persona.id_pais?.toString() || "",
          id_departamento: persona.id_departamento?.toString() || "",
          id_ciudad: persona.id_ciudad?.toString() || "",
          tipo_persona: persona.tipo_persona || "Física",
        });
  
        setSearchResults([persona]);
        setShowResults(true);
      }
      // Cliente encontrado - llenar formulario
    } catch (error: any) {
      console.error("Error al buscar persona:", error);
      // Cliente no encontrado
      Swal.fire(
          "No encontrado",
          "No se encontró una persona con esos datos.",
          "info"
        );
      setSearchResults([]);
      setShowResults(true);
      setClienteEncontrado(null);
    } finally {
      setIsLoading(false);
    }
  };

  const crearNuevoCliente = async () => {
    if (!validarFormulario()) return;

    try {
      setIsLoading(true);
      const datosPersona = {
        documento: formData.cedula,
        nombres: formData.nombre,
        apellidos: formData.apellido || "",
        telefono: formData.telefono || "",
        email: formData.email || "",
        direccion: formData.direccion || "",
        fecha_nacimiento: formData.fecha_nacimiento || "",
        id_ciudad: formData.id_ciudad
          ? parseInt(formData.id_ciudad)
          : undefined,
        tipo: formData.tipo_persona || "Fisica",
        id_corredor: parseInt(datosBasicos.corredorSeguros),
      };

      const resultado:any = await API.post("/api/personas", datosPersona);
      console.log(resultado)

      if (resultado.status === 200) {
        // Actualizar con el ID del nuevo cliente
        onDataChange({
          ...formData,
          id_persona: resultado.data.persona.id,
        });
        setClienteEncontrado(resultado.data.persona);
        setError("");
        alert("Cliente creado exitosamente");
      }
    } catch (error: any) {
      console.error("Error al crear cliente:", error);
      setError("Error al crear el cliente: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validarFormulario = () => {
    if (!formData.cedula || !formData.nombre) {
      setError("Cédula y nombre son obligatorios");
      return false;
    }
    return true;
  };

  const limpiarFormulario = () => {
    onDataChange({
      cedula: "",
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      direccion: "",
      fecha_nacimiento: "",
      id_pais: "",
      id_departamento: "",
      id_ciudad: "",
      tipo_persona: "Física",
    });
    setClienteEncontrado(null);
    setSearchResults([]);
    setShowResults(false);
    setError("");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Datos del Cliente
      </h2>

      {/* {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )} */}

      {/* Sección de búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label
            htmlFor="cedula"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Cédula *
          </label>
          <input
            type="text"
            id="cedula"
            name="cedula"
            value={formData.cedula}
            onChange={(e) => handleInputChange("cedula", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
            placeholder="Ingrese la cédula"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={buscarCliente}
            disabled={isLoading || !datosBasicos?.corredorSeguros}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isLoading || !datosBasicos?.corredorSeguros
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-principal text-white hover:bg-principal-dark"
            }`}
          >
            {isLoading ? "Buscando..." : " Buscar"}
          </button>

          <button
            onClick={limpiarFormulario}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Tabla de resultados */}
      {showResults && searchResults.length > 0 && (
        <div className="mb-6 p-4 border rounded-lg bg-green-50">
          <h3 className="text-lg font-semibold mb-2 text-green-700">
            Cliente Encontrado
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Nombre
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Cédula
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Teléfono
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((cliente, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">
                      {cliente.nombres} {cliente.apellidos}
                    </td>
                    <td className="px-4 py-2">{cliente.documento}</td>
                    <td className="px-4 py-2">{cliente.telefono || "N/A"}</td>
                    <td className="px-4 py-2">{cliente.email || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mensaje de no encontrado */}
      {/* {showResults && searchResults.length === 0 && (
        <div className="mb-6 p-4 border rounded-lg bg-yellow-50">
          <h3 className="text-lg font-semibold mb-2 text-yellow-700">
            Cliente no encontrado
          </h3>
          <p className="text-yellow-600">
            Complete los datos a continuación para crear un nuevo cliente.
          </p>
        </div>
      )} */}

      {/* Formulario de datos del cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => handleInputChange("nombre", e.target.value)}
            required
            disabled={!!clienteEncontrado}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
            placeholder="Nombre del cliente"
          />
        </div>

        <div>
          <label
            htmlFor="apellido"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Apellido
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido || ""}
            onChange={(e) => handleInputChange("apellido", e.target.value)}
            disabled={!!clienteEncontrado}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
            placeholder="Apellido del cliente"
          />
        </div>

        <div>
          <label
            htmlFor="telefono"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Teléfono
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono || ""}
            onChange={(e) => handleInputChange("telefono", e.target.value)}
            disabled={!!clienteEncontrado}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
            placeholder="Número de teléfono"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={!!clienteEncontrado}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
            placeholder="Correo electrónico"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="direccion"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Dirección
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion || ""}
            onChange={(e) => handleInputChange("direccion", e.target.value)}
            disabled={!!clienteEncontrado}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
            placeholder="Dirección completa"
          />
        </div>

        <div>
          <label
            htmlFor="fecha_nacimiento"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento || ""}
            onChange={(e) =>
              handleInputChange("fecha_nacimiento", e.target.value)
            }
            disabled={!!clienteEncontrado}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        <div>
          <label
            htmlFor="tipo_persona"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tipo de Persona
          </label>
          <select
            id="tipo_persona"
            name="tipo_persona"
            value={formData.tipo_persona || "Fisica"}
            onChange={(e) => handleInputChange("tipo_persona", e.target.value)}
            disabled={!!clienteEncontrado}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
          >
            <option value="Fisica">Física</option>
            <option value="Juridica">Jurídica</option>
          </select> 
        </div>

        <div>
          <label
            htmlFor="id_pais"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Pais
          </label>
          <select
            id="id_pais"
            name="id_pais"
            value={formData.id_pais || ""}
            onChange={(e) =>
              handleInputChange("id_pais", e.target.value)
            }
            disabled={!!clienteEncontrado}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Seleccione un pais</option>
            {paises.map((p) => (
              <option
                key={p.value}
                value={p.value?.toString()}
              >
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="id_departamento"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Departamento
          </label>
          <select
            id="id_departamento"
            name="id_departamento"
            value={formData.id_departamento || ""}
            onChange={(e) =>
              handleInputChange("id_departamento", e.target.value)
            }
            disabled={!!clienteEncontrado}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Seleccione un departamento</option>
            {departamentos.map((dep) => (
              <option
                key={dep.value}
                value={dep.value?.toString()}
              >
                {dep.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="id_ciudad"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Ciudad
          </label>
          <select
            id="id_ciudad"
            name="id_ciudad"
            value={formData.id_ciudad || ""}
            onChange={(e) => handleInputChange("id_ciudad", e.target.value)}
            disabled={!!clienteEncontrado || !formData.id_departamento}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Seleccione una ciudad</option>
            {ciudades.map((ciudad) => (
              <option
                key={ciudad.value}
                value={ciudad.value?.toString()}
              >
                {ciudad.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botón para crear nuevo cliente */}
      {/* {showResults && searchResults.length === 0 && !clienteEncontrado && (
        <div className="mt-6">
          <button
            onClick={crearNuevoCliente}
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              isLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-verde text-white hover:bg-verde-dark"
            }`}
          >
            {isLoading ? "Creando..." : "➕ Crear Nuevo Cliente"}
          </button>
        </div>
      )} */}

      {/* Estado del cliente */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Estado del cliente:
        </h3>
        <div className="flex items-center gap-2">
          {clienteEncontrado ? (
            <span className="px-3 py-1 bg-verde text-white rounded-full text-sm">
              Cliente encontrado y cargado
            </span>
          ) : formData.cedula && formData.nombre ? (
            <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm">
              Datos listos para crear cliente
            </span>
          ) : (
            <span className="px-3 py-1 bg-gray-300 text-gray-600 rounded-full text-sm">
              ○ Esperando datos del cliente
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default DatosCliente;
