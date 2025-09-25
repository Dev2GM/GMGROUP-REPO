import { useState, useEffect } from "react";
import API from "@/api/api";

interface DatosBasicosProps {
  formData: {
    corredorSeguros: string;
    canalComercial: string;
    numeroPoliza: string;
    referencia?: string;
    fechaInicio: string;
    fechaFin: string;
  };
  onDataChange: (data: any) => void;
}

function DatosBasicos({ formData, onDataChange }: DatosBasicosProps) {
  const [corredoresOptions, setCorredoresOptions] = useState<Array<any>>([]);
  const [canalComercialOptions, setCanalComercialOptions] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar corredores al montar el componente
  useEffect(() => {
    const fetchCorredores = async () => {
      try {
        const response = await API.get("/api/corredores", {
          headers: {
            "Authorization" : `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        if (response.status === 200) {
          setCorredoresOptions(response.data ?? []);
        } else {
          console.error("Error al obtener corredores:");
        }
      } catch {
        console.error("Error al obtener corredores:");
      }
    };

    fetchCorredores();
  }, []);

  // Cargar canales cuando cambia el corredor
  useEffect(() => {
    const cargarCanales = async () => {
      if (formData.corredorSeguros) {
        try {
          setLoading(true);
          const response = await API.get("/api/canales/filtrar?id_corredor="+formData.corredorSeguros)
          if (response.status === 200) {
            setCanalComercialOptions(response.data.canales);
          } else {
            setCanalComercialOptions([]);
          }
        } catch (error: any) {
          console.error("Error al cargar canales:", error);
          setCanalComercialOptions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setCanalComercialOptions([]);
      }
    };

    cargarCanales();
  }, [formData.corredorSeguros]);

  const handleInputChange = (name: string, value: string) => {
    const newFormData = {
      ...formData,
      [name]: value,
    };

    // Si cambia el corredor, limpiar el canal comercial
    if (name === "corredorSeguros") {
      newFormData.canalComercial = "";
    }

    onDataChange(newFormData);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos Básicos</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Corredor de seguros */}
        <div>
          <label
            htmlFor="corredorSeguros"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Corredor de seguros *
          </label>
          <select
            id="corredorSeguros"
            name="corredorSeguros"
            value={formData.corredorSeguros}
            onChange={(e) =>
              handleInputChange("corredorSeguros", e.target.value)
            }
            disabled={loading}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Seleccione un corredor</option>
            {corredoresOptions.map((corredor) => (
              <option
                key={corredor.id}
                value={corredor.id}
              >
                {corredor.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Canal Comercial */}
        <div>
          <label
            htmlFor="canalComercial"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Canal Comercial *
          </label>
          <select
            id="canalComercial"
            name="canalComercial"
            value={formData.canalComercial}
            onChange={(e) =>
              handleInputChange("canalComercial", e.target.value)
            }
            disabled={loading || !formData.corredorSeguros}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Seleccione un canal</option>
            {canalComercialOptions.map((canal) => (
              <option key={canal.id} value={canal.id}>
                {canal.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Número de póliza */}
        <div>
          <label
            htmlFor="numeroPoliza"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Número de póliza *
          </label>
          <input
            type="text"
            id="numeroPoliza"
            name="numeroPoliza"
            value={formData.numeroPoliza}
            onChange={(e) => handleInputChange("numeroPoliza", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
            placeholder="Ingrese el número de póliza"
          />
        </div>

        {/* Referencia */}
        <div>
          <label
            htmlFor="referencia"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Referencia (opcional)
          </label>
          <input
            type="text"
            id="referencia"
            name="referencia"
            value={formData.referencia || ""}
            onChange={(e) => handleInputChange("referencia", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
            placeholder="Referencia opcional"
          />
        </div>

        {/* Fecha de inicio */}
        <div>
          <label
            htmlFor="fechaInicio"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fecha de inicio *
          </label>
          <input
            type="date"
            id="fechaInicio"
            name="fechaInicio"
            value={formData.fechaInicio}
            onChange={(e) => handleInputChange("fechaInicio", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
          />
        </div>

        {/* Fecha de fin */}
        <div>
          <label
            htmlFor="fechaFin"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fecha de fin *
          </label>
          <input
            type="date"
            id="fechaFin"
            name="fechaFin"
            value={formData.fechaFin}
            onChange={(e) => handleInputChange("fechaFin", e.target.value)}
            required
            min={formData.fechaInicio} // No puede ser anterior a la fecha de inicio
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
          />
        </div>
      </div>

      {/* Validaciones visuales */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Campos completados:
        </h3>
        <div className="flex flex-wrap gap-2">
          <span
            className={`px-2 py-1 rounded text-xs ${
              formData.corredorSeguros
                ? "bg-verde text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Corredor {formData.corredorSeguros ? "✓" : "○"}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              formData.canalComercial
                ? "bg-verde text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Canal {formData.canalComercial ? "✓" : "○"}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              formData.numeroPoliza
                ? "bg-verde text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Número {formData.numeroPoliza ? "✓" : "○"}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              formData.fechaInicio
                ? "bg-verde text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            F. Inicio {formData.fechaInicio ? "✓" : "○"}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              formData.fechaFin
                ? "bg-verde text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            F. Fin {formData.fechaFin ? "✓" : "○"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DatosBasicos;
