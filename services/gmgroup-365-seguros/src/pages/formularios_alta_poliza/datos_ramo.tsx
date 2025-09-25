import { useState, useEffect } from "react";
import API from "@/api/api";

interface DatosRamoProps {
  formData: {
    ramo: string;
    camposRamo: Record<string, string>;
    tieneSeguroAutomotor: boolean;
    marca: string;
    modelo: string;
    año: string;
  };
  datosBasicos: {
    corredorSeguros: string;
  };
  onDataChange: (data: any) => void;
}

function DatosRamo({ formData, datosBasicos, onDataChange }: DatosRamoProps) {
  const [ramosOptions, setRamosOptions] = useState<any[]>([]);
  const [camposRamoDisponibles, setCamposRamoDisponibles] = useState<
    any[]
  >([]);
  const [marcasOptions, setMarcasOptions] = useState<any[]>([]);
  const [modelosOptions, setModelosOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar ramos cuando hay un corredor seleccionado
  useEffect(() => {
    const cargarRamos = async () => {
      if (datosBasicos?.corredorSeguros) {
        try {
          setLoading(true);
          const response = await API.get("/api/ramos/filter/" + datosBasicos.corredorSeguros)
          setRamosOptions(response.data);
        } catch (error: any) {
          console.error("Error al cargar ramos:", error);
          setRamosOptions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setRamosOptions([]);
      }
    };

    cargarRamos();
  }, [datosBasicos?.corredorSeguros]);

  // Cargar campos del ramo cuando se selecciona uno
  // useEffect(() => {
  //   const cargarCamposRamo = async () => {
  //     if (formData.ramo) {
  //       try {
  //         setLoading(true);
  //         const campos = await getCamposRamo(parseInt(formData.ramo));
  //         setCamposRamoDisponibles(campos);

  //         // Inicializar valores de campos dinámicos
  //         const camposIniciales: Record<string, string> = {};
  //         campos.forEach((campo) => {
  //           camposIniciales[campo.id_campo.toString()] =
  //             formData.camposRamo[campo.id_campo.toString()] || "";
  //         });

  //         onDataChange({
  //           ...formData,
  //           camposRamo: camposIniciales,
  //         });
  //       } catch (error: any) {
  //         console.error("Error al cargar campos del ramo:", error);
  //         setCamposRamoDisponibles([]);
  //       } finally {
  //         setLoading(false);
  //       }
  //     } else {
  //       setCamposRamoDisponibles([]);
  //       onDataChange({
  //         ...formData,
  //         camposRamo: {},
  //       });
  //     }
  //   };

  //   cargarCamposRamo();
  // }, [formData.ramo]);

  // Cargar marcas al montar el componente
  useEffect(() => {
    const cargarMarcas = async () => {
      try {
        const response = await API.get("/api/autodata");
        setMarcasOptions(response.data);
      } catch (error: any) {
        console.error("Error al cargar marcas:", error);
      }
    };

    cargarMarcas();
  }, []);

  // Cargar modelos cuando cambia la marca
  useEffect(() => {
    const marca = marcasOptions.find((m) => m.id == formData.marca)
    setModelosOptions(marca?.modelos ?? [])
  }, [formData.marca]);

  // Función para manejar cambios en los inputs normales
  const handleInputChange = (name: string, value: string | boolean) => {
    const newFormData = {
      ...formData,
      [name]: value,
    };

    // Si cambia la marca, limpiar el modelo
    if (name === "marca") {
      newFormData.modelo = "";
    }

    // Si cambia el ramo, limpiar los campos del ramo anterior
    if (name === "ramo") {
      newFormData.camposRamo = {};
    }

    onDataChange(newFormData);
  };

  // Función para manejar cambios en campos dinámicos del ramo
  const handleCampoRamoChange = (idCampo: string, valor: string) => {
    const nuevosCamposRamo = {
      ...formData.camposRamo,
      [idCampo]: valor,
    };

    onDataChange({
      ...formData,
      camposRamo: nuevosCamposRamo,
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos del Ramo</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Mensaje informativo si no hay corredor seleccionado */}
      {!datosBasicos?.corredorSeguros && (
        <div className="mb-6 p-4 border rounded-lg bg-yellow-50">
          <p className="text-yellow-600 flex items-center">
            <span className="mr-2">⚠️</span>
            Debe seleccionar un corredor en los datos básicos para cargar los
            ramos disponibles.
          </p>
        </div>
      )}

      {/* Sección principal - Ramo */}
      <div className="mb-6">
        <label
          htmlFor="ramo"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Ramo *
        </label>
        <select
          id="ramo"
          name="ramo"
          value={formData.ramo}
          onChange={(e) => handleInputChange("ramo", e.target.value)}
          disabled={loading || !datosBasicos?.corredorSeguros}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
        >
          <option value="">Seleccione un ramo</option>
          {ramosOptions.map((ramo) => (
            <option key={ramo.id} value={ramo.id.toString()}>
              {ramo.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Campos del ramo - Se muestran cuando hay un ramo seleccionado */}
      {formData.ramo && camposRamoDisponibles.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Campos del Ramo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {camposRamoDisponibles.map((campo) => (
              <div key={campo.id_campo}>
                <label
                  htmlFor={`campo_${campo.id_campo}`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {campo.nombre_campo}
                </label>
                <input
                  id={`campo_${campo.id_campo}`}
                  name={`campo_${campo.id_campo}`}
                  type={campo.tipo_dato === "number" ? "number" : "text"}
                  value={formData.camposRamo[campo.id_campo.toString()] || ""}
                  onChange={(e) =>
                    handleCampoRamoChange(
                      campo.id_campo.toString(),
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
                  placeholder={`Ingrese ${campo.nombre_campo.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checkbox seguro automotor */}
      {formData.ramo && (
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="tieneSeguroAutomotor"
              name="tieneSeguroAutomotor"
              checked={formData.tieneSeguroAutomotor}
              onChange={(e) =>
                handleInputChange("tieneSeguroAutomotor", e.target.checked)
              }
              className="w-4 h-4 text-principal bg-gray-100 border-gray-300 rounded focus:ring-principal focus:ring-2"
            />
            <label
              htmlFor="tieneSeguroAutomotor"
              className="text-sm font-medium text-gray-700"
            >
              ¿Tiene seguro automotor?
            </label>
          </div>
        </div>
      )}

      {/* Campos del seguro automotor - Se muestran cuando el checkbox está marcado */}
      {formData.tieneSeguroAutomotor && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Datos del Vehículo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Marca */}
            <div>
              <label
                htmlFor="marca"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Marca *
              </label>
              <select
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={(e) => handleInputChange("marca", e.target.value)}
                disabled={loading}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccione una marca</option>
                {marcasOptions.map((marca) => (
                  <option
                    key={marca.id}
                    value={marca.id}
                  >
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Modelo */}
            <div>
              <label
                htmlFor="modelo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Modelo *
              </label>
              <select
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={(e) => handleInputChange("modelo", e.target.value)}
                disabled={loading || !formData.marca}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Seleccione un modelo</option>
                {modelosOptions.map((modelo) => (
                  <option
                    key={modelo.id}
                    value={modelo.id}
                  >
                    {modelo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Año */}
            <div>
              <label
                htmlFor="año"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Año *
              </label>
              <input
                type="number"
                id="año"
                name="año"
                value={formData.año}
                onChange={(e) => handleInputChange("año", e.target.value)}
                min="1900"
                max={new Date().getFullYear() + 1}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
                placeholder="2024"
              />
            </div>
          </div>
        </div>
      )}

      {/* Indicadores de progreso */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Estado del ramo:
        </h3>
        <div className="flex flex-wrap gap-2">
          <span
            className={`px-2 py-1 rounded text-xs ${
              formData.ramo
                ? "bg-verde text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Ramo {formData.ramo ? "✓" : "○"}
          </span>
          {camposRamoDisponibles.length > 0 && (
            <span
              className={`px-2 py-1 rounded text-xs ${
                Object.keys(formData.camposRamo).length ===
                camposRamoDisponibles.length
                  ? "bg-verde text-white"
                  : "bg-yellow-500 text-white"
              }`}
            >
              Campos Ramo ({Object.keys(formData.camposRamo).length}/
              {camposRamoDisponibles.length})
            </span>
          )}
          {formData.tieneSeguroAutomotor && (
            <>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  formData.marca
                    ? "bg-verde text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                Marca {formData.marca ? "✓" : "○"}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  formData.modelo
                    ? "bg-verde text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                Modelo {formData.modelo ? "✓" : "○"}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  formData.año
                    ? "bg-verde text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                Año {formData.año ? "✓" : "○"}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DatosRamo;
