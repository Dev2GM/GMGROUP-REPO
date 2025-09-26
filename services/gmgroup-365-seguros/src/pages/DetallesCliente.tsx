import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { generateClientReport } from "./detalles_cliente/btn_impresion";

interface ClientData {
  nombre: string;
  apellido: string;
  cedula: string;
  fecha_nacimiento: string;
  departamento: string;
  ciudad: string;
  domicilio: string;
  telefono: string;
  email: string;
  puntos: string;
  es_cliente: boolean;
}

interface Activity {
  fecha: string;
  actividad: string;
  mensaje: string;
  usuario: string;
}

interface Policy {
  numero: string;
  compania: string;
  estado: string;
  inicio: string;
  fin: string;
  moneda: string;
  precio: string;
}

export default function ClientDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const clientData = location.state?.clientData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ClientData>({} as ClientData);
  const [activities, setActivities] = useState<Activity[]>([
    {
      fecha: "2024-01-15",
      actividad: "Contacto inicial",
      mensaje: "Cliente interesado en póliza de auto",
      usuario: "Juan Pérez",
    },
    {
      fecha: "2024-01-20",
      actividad: "Seguimiento",
      mensaje: "Envío de cotización por email",
      usuario: "María García",
    },
    {
      fecha: "2024-01-25",
      actividad: "Venta",
      mensaje: "Póliza contratada - Auto Toyota 2020",
      usuario: "Juan Pérez",
    },
  ]);
  const [policies, setPolicies] = useState<Policy[]>([
    {
      numero: "POL-2024-001",
      compania: "Seguros del Sur",
      estado: "Activa",
      inicio: "2024-01-25",
      fin: "2025-01-25",
      moneda: "USD",
      precio: "$1,200",
    },
    {
      numero: "POL-2023-045",
      compania: "Aseguradora Nacional",
      estado: "Vencida",
      inicio: "2023-01-15",
      fin: "2024-01-15",
      moneda: "USD",
      precio: "$800",
    },
  ]);
  const [observations, setObservations] = useState(
    "Cliente muy colaborativo, siempre puntual con los pagos. Prefiere comunicación por WhatsApp. Tiene interés en ampliar cobertura el próximo año."
  );
  const [newObservation, setNewObservation] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Inicializar datos de prueba si no hay clientData
  const defaultClientData: ClientData = {
    nombre: "Carlos Alberto",
    apellido: "González Martínez",
    cedula: "12345678",
    fecha_nacimiento: "1985-03-15",
    departamento: "Montevideo",
    ciudad: "Montevideo",
    domicilio: "Av. 18 de Julio 1234, Apto 5B",
    telefono: "+598 99 123 456",
    email: "carlos.gonzalez@email.com",
    puntos: "2,450",
    es_cliente: true,
  };

  const currentClientData: ClientData = clientData || defaultClientData;

  useEffect(() => {
    setEditedData(currentClientData);
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Guardar cambios
      setLoading(true);
      // Aquí iría la llamada a la API para guardar
      setTimeout(() => {
        setLoading(false);
        setIsEditing(false);
        // Actualizar datos si es necesario
      }, 1000);
    } else {
      setIsEditing(true);
      setEditedData(currentClientData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchClientDetails = async () => {
    // Aquí irían las llamadas para obtener más detalles del cliente
    // setLoading(true);
    // try {
    //   const response = await fetch(`${API_URL}/api/cliente/${id}`);
    //   const data = await response.json();
    //   // Actualizar estado con más información
    // } catch (error) {
    //   setError("Error al cargar los detalles del cliente");
    // } finally {
    //   setLoading(false);
    // }
  };

  const fetchActivities = async () => {
    // Llamada para obtener actividades del cliente
  };

  const fetchPolicies = async () => {
    // Llamada para obtener pólizas del cliente
  };

  const handleAddObservation = async () => {
    if (!newObservation.trim()) return;

    setLoading(true);
    try {
      // Aquí iría la llamada a la API para guardar la observación
      setTimeout(() => {
        const currentDate = new Date().toLocaleString();
        const newActivity: Activity = {
          fecha: new Date().toISOString().split("T")[0],
          actividad: "Observación",
          mensaje: newObservation,
          usuario: "Usuario Actual",
        };

        setActivities((prev) => [newActivity, ...prev]);
        setObservations((prev) =>
          prev
            ? prev + "\n\n" + `[${currentDate}] ${newObservation}`
            : `[${currentDate}] ${newObservation}`
        );
        setNewObservation("");
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError("Error al guardar la observación");
      setLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    console.log(`Acción: ${action}`);

    if (action === "print") {
      generateClientReport(
        currentClientData,
        activities,
        policies,
        observations
      );
      return;
    }
  };

  if (!currentClientData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          No se encontraron datos del cliente
        </div>
        <Button onClick={() => navigate(-1)} className="mt-4" variant="default">
          Volver
        </Button>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Detalles del cliente</h1>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Botones  */}
      <div className="grid grid-cols-1 md:grid-cols-5  gap-3 mb-6">
        <Button
          onClick={() => handleActionClick("upload")}
          variant="default"
          size="default"
          className="rounded-xl"
        >
          Subir documento
        </Button>
        <Button
          onClick={() => handleActionClick("print")}
          variant="default"
          size="default"
          className="rounded-xl"
        >
          Impresión
        </Button>
        <Button
          onClick={() => handleActionClick("claim")}
          variant="default"
          size="default"
          className="rounded-xl"
        >
          Siniestro
        </Button>
        <Button
          onClick={() => navigate("/alta-poliza")}
          variant="default"
          size="default"
          className="rounded-xl"
        >
          Alta póliza
        </Button>
        <Button
          onClick={() => handleActionClick("crm")}
          variant="default"
          size="default"
          className="rounded-xl"
        >
          Gestionar CRM
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Información básica  */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Información Básica
            </h2>
            <Button
              onClick={handleEditToggle}
              variant="default"
              size="default"
              className="rounded-xl"
              disabled={loading}
            >
              {isEditing ? (loading ? "Guardando..." : "Guardar") : "Editar"}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.nombre || ""}
                    onChange={(e) =>
                      handleInputChange("nombre", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
                  />
                ) : (
                  <div className="text-gray-900 font-medium capitalize py-2">
                    {currentClientData.nombre}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.apellido || ""}
                    onChange={(e) =>
                      handleInputChange("apellido", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
                  />
                ) : (
                  <div className="text-gray-900 font-medium capitalize py-2">
                    {currentClientData.apellido}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Documento
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.cedula || ""}
                  onChange={(e) => handleInputChange("cedula", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
                />
              ) : (
                <div className="text-gray-900 py-2">
                  {currentClientData.cedula || "No especificado"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de nacimiento
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedData.fecha_nacimiento || ""}
                  onChange={(e) =>
                    handleInputChange("fecha_nacimiento", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
                />
              ) : (
                <div className="text-gray-900 py-2">
                  {currentClientData.fecha_nacimiento || "No especificado"}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.departamento || ""}
                    onChange={(e) =>
                      handleInputChange("departamento", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
                  />
                ) : (
                  <div className="text-gray-900 py-2">
                    {currentClientData.departamento || "No especificado"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.ciudad || ""}
                    onChange={(e) =>
                      handleInputChange("ciudad", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
                  />
                ) : (
                  <div className="text-gray-900 py-2">
                    {currentClientData.ciudad || "No especificado"}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domicilio
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.domicilio || ""}
                  onChange={(e) =>
                    handleInputChange("domicilio", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
                />
              ) : (
                <div className="text-gray-900 py-2">
                  {currentClientData.domicilio || "No especificado"}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.telefono || ""}
                    onChange={(e) =>
                      handleInputChange("telefono", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
                  />
                ) : (
                  <div className="text-gray-900 py-2">
                    {currentClientData.telefono || "No especificado"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
                  />
                ) : (
                  <div className="text-gray-900 py-2">
                    {currentClientData.email || "No especificado"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Información Adicional
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puntos generados
              </label>
              <div className="text-gray-900 font-medium">
                {currentClientData.puntos || "0"} puntos
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pólizas activas
              </label>
              <div className="text-gray-900 font-medium">
                {policies.filter((p) => p.estado === "Activa").length || "0"}{" "}
                pólizas
              </div>
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clasificación
              </label>
              <div className="text-gray-900 font-medium">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    currentClientData.es_cliente
                      ? "bg-verde text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentClientData.es_cliente ? "Cliente" : "No es cliente"}
                </span>
              </div>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Últimas observaciones
              </label>
              <div className="bg-gray-50 rounded-lg p-4 min-h-24 border border-gray-200 text-sm text-gray-700">
                {observations || "No hay observaciones registradas"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva observación
              </label>
              <textarea
                value={newObservation}
                onChange={(e) => setNewObservation(e.target.value)}
                placeholder="Escriba una nueva observación..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleAddObservation}
              variant="default"
              size="default"
              className="rounded-xl"
              disabled={loading || !newObservation.trim()}
            >
              {loading ? "Guardando..." : "Agregar observación"}
            </Button>
          </div>
        </div>
      </div>

      {/* Secciones inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registro de actividades */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Registro de Actividades
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 rounded-lg">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 rounded-l-lg">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                    Actividad
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">
                    Mensaje
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 rounded-r-lg">
                    Usuario
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {activity.fecha}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {activity.actividad}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {activity.mensaje}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {activity.usuario}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-gray-500 text-sm"
                    >
                      No hay actividades registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pólizas */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pólizas</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 rounded-lg">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 rounded-l-lg">
                    No.
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-700">
                    Compañía
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-700">
                    Estado
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-700">
                    Inicio
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-700">
                    Fin
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-700">
                    Moneda
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 rounded-r-lg">
                    Precio
                  </th>
                </tr>
              </thead>
              <tbody>
                {policies.length > 0 ? (
                  policies.map((policy, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {policy.numero}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {policy.compania}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            policy.estado === "Activa"
                              ? "bg-verde text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {policy.estado}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {policy.inicio}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {policy.fin}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {policy.moneda}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {policy.precio}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-8 text-center text-gray-500 text-sm"
                    >
                      No hay pólizas registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Botón para volver */}
      <div className="mt-6 text-center">
        <Button
          onClick={() => navigate(-1)}
          variant="default"
          size="lg"
          className="rounded-xl"
        >
          Volver a la búsqueda
        </Button>
      </div>
    </section>
  );
}
