import { useState, useEffect } from "react";
import API from "@/api/api";

interface DatosMonetariosProps {
  formData: {
    compania: string;
    cobertura: string;
    moneda: string;
    prima: string;
    cuotas: string;
    precio: string;
    vencimiento: string;
    medioPago: string;
  };
  onDataChange: (data: any) => void;
}

function DatosMonetarios({ 
  formData, onDataChange
 }: DatosMonetariosProps) {
  const [companiasOptions, setCompaniasOptions] = useState<any[]>([]);
  const [monedasOptions, setMonedasOptions] = useState<any[]>([]);
  const [coberturasOptions, setCoberturasOptions] = useState<any[]>([]);
  const [metodosPagoOptions, setMetodosPagoOptions] = useState<any[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar compañías y métodos de pago al montar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        // Cargar compañías
        const response = await API.get("/api/datos-monetarios");

        if (response.status === 200) {
          setMonedasOptions(response.data.data.monedas);
          setCompaniasOptions(response.data.data.companias);
          setMetodosPagoOptions(response.data.data.metodos);
        }
      } catch (error: any) {
        console.error("Error al cargar datos:", error);
        setError("Error al cargar los datos necesarios");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Cargar coberturas cuando cambia la compañía
  useEffect(() => {
    if (formData.compania) {
      const companiaSeleccionada = companiasOptions.find(
        (comp) => comp.id.toString() === formData.compania
      );
      setCoberturasOptions(companiaSeleccionada?.coberturas || []);
    } else {
      setCoberturasOptions([]);
    }
  }, [formData.compania, companiasOptions]);

  // Calcular fecha de vencimiento automáticamente (30 días después de fecha inicio)
  useEffect(() => {
    if (formData.precio && formData.cuotas) {
      // Puedes agregar aquí lógica adicional si necesitas calcular algo automáticamente
    }
  }, [formData.precio, formData.cuotas]);

  const handleInputChange = (name: string, value: string) => {
    const newFormData = {
      ...formData,
      [name]: value,
    };

    // Si cambia la compañía, limpiar la cobertura
    if (name === "compania") {
      newFormData.cobertura = "";
    }

    onDataChange(newFormData);
  };

  // Calcular cuota individual
  const calcularCuotaIndividual = () => {
    const precio = parseFloat(formData.precio) || 0;
    const cuotas = parseInt(formData.cuotas) || 1;
    return precio / cuotas;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Datos Monetarios
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Compañía */}
        <div>
          <label
            htmlFor="compania"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Compañía *
          </label>
          <select
            id="compania"
            name="compania"
            value={formData.compania}
            onChange={(e) => handleInputChange("compania", e.target.value)}
            disabled={loading}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Seleccione una compañía</option>
            {companiasOptions.map((comp) => (
              <option
                key={comp.id}
                value={comp.id.toString()}
              >
                {comp.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Cobertura */}
        <div>
          <label
            htmlFor="cobertura"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Cobertura *
          </label>
          <select
            id="cobertura"
            name="cobertura"
            value={formData.cobertura}
            onChange={(e) => handleInputChange("cobertura", e.target.value)}
            disabled={loading || !formData.compania}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Seleccione una cobertura</option>
            {coberturasOptions.map((cob) => (
              <option
                key={cob.id}
                value={cob.id.toString()}
              >
                {cob.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Moneda */}
        <div>
          <label
            htmlFor="moneda"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Moneda *
          </label>
          <select
            id="moneda"
            name="moneda"
            value={formData.moneda}
            onChange={(e) => handleInputChange("moneda", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
          >
            {monedasOptions.map((moneda) => (
              <option key={moneda.id} value={moneda.id}>
                {moneda.codigo_iso} - {moneda.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Precio */}
        <div>
          <label
            htmlFor="precio"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Precio *
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            step="0.01"
            min="0"
            value={formData.precio}
            onChange={(e) => handleInputChange("precio", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        {/* Prima */}
        <div>
          <label
            htmlFor="prima"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Prima *
          </label>
          <input
            type="number"
            id="prima"
            name="prima"
            step="0.01"
            min="0"
            value={formData.prima}
            onChange={(e) => handleInputChange("prima", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        {/* Número de Cuotas */}
        <div>
          <label
            htmlFor="cuotas"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Número de Cuotas *
          </label>
          <input
            type="number"
            id="cuotas"
            name="cuotas"
            min="1"
            value={formData.cuotas}
            onChange={(e) => handleInputChange("cuotas", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
          />
        </div>

        {/* Vencimiento de la 1° cuota */}
        <div>
          <label
            htmlFor="vencimiento"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Vencimiento de la 1° cuota
          </label>
          <input
            type="date"
            id="vencimiento"
            name="vencimiento"
            value={formData.vencimiento}
            onChange={(e) => handleInputChange("vencimiento", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent"
          />
          <p className="text-xs text-gray-600 mt-1">
            <strong>Nota:</strong> Por defecto se configura 30 días después de
            la fecha de inicio
          </p>
        </div>

        {/* Medio de Pago */}
        <div>
          <label
            htmlFor="medioPago"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Medio de pago *
          </label>
          <select
            id="medioPago"
            name="medioPago"
            value={formData.medioPago}
            onChange={(e) => handleInputChange("medioPago", e.target.value)}
            disabled={loading}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-principal focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Seleccione un método de pago</option>
            {metodosPagoOptions.map((metodo) => (
              <option
                key={metodo.id}
                value={metodo.id.toString()}
              >
                {metodo.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cálculos automáticos
      {formData.precio && formData.cuotas && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Resumen de Pagos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: formData.moneda,
                }).format(parseFloat(formData.precio) || 0)}
              </div>
              <div className="text-sm text-gray-600">Precio Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formData.cuotas}
              </div>
              <div className="text-sm text-gray-600">Cuotas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: formData.moneda,
                }).format(calcularCuotaIndividual())}
              </div>
              <div className="text-sm text-gray-600">Por Cuota</div>
            </div>
          </div>
        </div>
      )} */}

      {/* Indicadores de progreso */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Campos completados:
        </h3>
        <div className="flex flex-wrap gap-2">
          <span
            className={`px-2 py-1 rounded text-xs ${
              formData.compania
                ? "bg-verde text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Compañía {formData.compania ? "✓" : "○"}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              formData.cobertura
                ? "bg-verde text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Cobertura {formData.cobertura ? "✓" : "○"}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              formData.precio
                ? "bg-verde text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Precio {formData.precio ? "✓" : "○"}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              formData.prima
                ? "bg-verde text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Prima {formData.prima ? "✓" : "○"}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              formData.medioPago
                ? "bg-verde text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Medio Pago {formData.medioPago ? "✓" : "○"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DatosMonetarios;
