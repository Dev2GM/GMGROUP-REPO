import { useState, useEffect } from "react";

import Stepper from "../components/stepper"; // Tu stepper personalizado
import DatosBasicos from "./formularios_alta_poliza/datos_basicos";
import DatosCliente from "./formularios_alta_poliza/datos_cliente";
import DatosMonetarios from "./formularios_alta_poliza/datos_monetarios";
import DatosRamo from "./formularios_alta_poliza/datos_ramo";
import Resumen from "./formularios_alta_poliza/resumen";

import { addYear, addMonth, today } from "@/lib/utils";
import API from "@/api/api";

import type { FormPoliza } from "@/types/Polizas";


import Swal from "sweetalert2";


export default function AltaPoliza() {
  const [pasoActual, setPasoActual] = useState(1);
  const [formData, setFormData] = useState<FormPoliza>({
    datosBasicos: {
      corredorSeguros: "",
      canalComercial: "",
      numeroPoliza: "",
      referencia: "",
      fechaInicio: today(),
      fechaFin: "",
    },
    datosCliente: {
      cedula: "",
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      direccion: "",
      fecha_nacimiento: "",
      id_departamento: "",
      id_ciudad: "",
      tipo_persona: "Física",
      id_persona: ""
    },
    datosMonetarios: {
      compania: "",
      cobertura: "",
      moneda: "1",
      prima: "",
      cuotas: "1",
      precio: "",
      vencimiento: "",
      medioPago: "",
    },
    datosRamo: {
      ramo: "",
      camposRamo: {},
      tieneSeguroAutomotor: false,
      marca: "",
      modelo: "",
      año: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Configuración de pasos para tu stepper
  const pasos = [
    { numero: 1, titulo: "Datos Básicos" },
    { numero: 2, titulo: "Datos del Cliente" },
    { numero: 3, titulo: "Datos Monetarios" },
    { numero: 4, titulo: "Datos del Ramo" },
    // { numero: 5, titulo: "Resumen" },
  ];

  useEffect(() => {
    const fechaInicio = formData.datosBasicos.fechaInicio;

    if (fechaInicio && fechaInicio !== "" && fechaInicio !== null) {
      const nuevaFechaFin = addYear(fechaInicio);
      const nuevoVencimiento = addMonth(fechaInicio);

      setFormData((prev) => {
        const debeActualizarFin =
          prev.datosBasicos.fechaFin !== nuevaFechaFin;
        const debeActualizarVencimiento =
          prev.datosMonetarios.vencimiento !== nuevoVencimiento;

        // Si no hay cambios, no actualizar el estado
        if (!debeActualizarFin && !debeActualizarVencimiento) {
          return prev;
        }

        return {
          ...prev,
          datosBasicos: {
            ...prev.datosBasicos,
            ...(debeActualizarFin && { fechaFin: nuevaFechaFin }),
          },
          datosMonetarios: {
            ...prev.datosMonetarios,
            ...(debeActualizarVencimiento && { vencimiento: nuevoVencimiento }),
          },
        };
      });
    }
  }, [formData.datosBasicos.fechaInicio]);



  // Función para manejar cambios en los datos
  const handleDataChange = (section: keyof FormPoliza, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  // Validación por paso
  const validarPasoActual = (): boolean => {
    switch (pasoActual) {
      case 1: // Datos Básicos
        return !!(
          formData.datosBasicos.corredorSeguros &&
          formData.datosBasicos.canalComercial &&
          formData.datosBasicos.numeroPoliza &&
          formData.datosBasicos.fechaInicio &&
          formData.datosBasicos.fechaFin
        );

      case 2: // Datos Cliente
        return !!(formData.datosCliente.cedula && formData.datosCliente.nombre);

      case 3: // Datos Monetarios
        return !!(
          formData.datosMonetarios.compania &&
          formData.datosMonetarios.cobertura &&
          formData.datosMonetarios.precio &&
          formData.datosMonetarios.prima &&
          formData.datosMonetarios.medioPago
        );

      case 4: // Datos Ramo
        return !!formData.datosRamo.ramo;

      // case 5: // Resumen
      //   return true;

      default:
        return false;
    }
  };

  // Navegación entre pasos
  const siguientePaso = () => {
    if (validarPasoActual() && pasoActual < pasos.length) {
      setPasoActual(pasoActual + 1);
      setSubmitError("");
    }
  };

  const pasoAnterior = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
      setSubmitError("");
    }
  };

  // Función para enviar la póliza
  const handleSubmit = async () => {
    if (!validarPasoActual()) {
      setSubmitError("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const payload = {
        codigo: formData.datosBasicos.numeroPoliza,
        fecha_inicio: formData.datosBasicos.fechaInicio,
        fecha_fin: formData.datosBasicos.fechaFin,
        precio: parseFloat(formData.datosMonetarios.precio),
        n_cuotas: parseInt(formData.datosMonetarios.cuotas),
        prima: parseFloat(formData.datosMonetarios.prima),
        referencia: formData.datosBasicos.referencia,
        id_cobertura: formData.datosMonetarios.cobertura,
        id_moneda: formData.datosMonetarios.moneda,
        id_metodo: formData.datosMonetarios.medioPago,
        // id_auto: 1,       // deberías mapearlo según tus tablas
        id_persona: formData.datosCliente.id_persona,    // idem
        id_canal: formData.datosBasicos.canalComercial,
        id_corredor: formData.datosBasicos.corredorSeguros,
      };

      console.log(payload)

      const response = await API.post("/api/polizas", payload);

      if (response.status === 200) {
        setSubmitSuccess(true);
        Swal.fire(
          "Exito",
          `¡Póliza creada exitosamente! ID: ${payload.codigo}`,
          "success"
        );
        // Limpiar formulario y volver al inicio
        reiniciarFormulario();
      } else {
        Swal.fire(
          "Error",
          "El codigo de poliza ya existe",
          "error"
        );
      }


    } catch (error: any) {
      console.error("Error al crear póliza:", error);
      Swal.fire(
        "Error",
        "Error al crear la poliza",
        "error"
      );
      setSubmitError(`Error al crear la póliza: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para reiniciar el formulario
  const reiniciarFormulario = () => {
    setFormData({
      datosBasicos: {
        corredorSeguros: "",
        canalComercial: "",
        numeroPoliza: "",
        referencia: "",
        fechaInicio: "",
        fechaFin: "",
      },
      datosCliente: {
        cedula: "",
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        direccion: "",
        fecha_nacimiento: "",
        id_departamento: "",
        id_ciudad: "",
        tipo_persona: "Física",
      },
      datosMonetarios: {
        compania: "",
        cobertura: "",
        moneda: "MXN",
        prima: "",
        cuotas: "1",
        precio: "",
        vencimiento: "",
        medioPago: "",
      },
      datosRamo: {
        ramo: "",
        camposRamo: {},
        tieneSeguroAutomotor: false,
        marca: "",
        modelo: "",
        año: "",
      },
    });
    setPasoActual(1);
    setSubmitError("");
    setSubmitSuccess(false);
  };

  // Renderizar el componente del paso actual
  const renderPasoActual = () => {
    switch (pasoActual) {
      case 1:
        return (
          <DatosBasicos
            formData={formData.datosBasicos}
            onDataChange={(data: any) => handleDataChange("datosBasicos", data)}
          />
        );
      case 2:
        return (
          <DatosCliente
            formData={formData.datosCliente}
            datosBasicos={formData.datosBasicos}
            onDataChange={(data: any) => handleDataChange("datosCliente", data)}
          />
        );
      case 3:
        return (
          <DatosMonetarios
            formData={formData.datosMonetarios}
            onDataChange={(data: FormPoliza["datosMonetarios"]) => {
              handleDataChange("datosMonetarios", data);
            }}
          />
        );
      case 4:
        return (
          <DatosRamo
            formData={formData.datosRamo}
            datosBasicos={formData.datosBasicos}
            onDataChange={(data: FormPoliza["datosRamo"]) => {
              handleDataChange("datosRamo", data);
            }}
          />
        );
      case 5:
        return <Resumen formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Crear Nueva Póliza
        </h1>

        {/* Tu stepper personalizado */}
        <div className="mb-8">
          <Stepper pasoActual={pasoActual} pasos={pasos} />
        </div>
      </div>

      {/* Mensajes de estado */}
      {submitError && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <span className="mr-2">❌</span>
            {submitError}
          </div>
        </div>
      )}

      {submitSuccess && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            ¡Póliza creada exitosamente!
          </div>
        </div>
      )}

      {/* Contenido del paso actual */}
      <div className="bg-white shadow-sm  rounded-lg">{renderPasoActual()}</div>

      {/* Botones de navegación */}
      <div className="flex justify-between items-center mt-8 pt-6">
        <button
          onClick={pasoAnterior}
          disabled={pasoActual === 1}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            pasoActual === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Anterior
        </button>

        <div className="flex space-x-4">
          {pasoActual < pasos.length ? (
            <button
              onClick={siguientePaso}
              disabled={!validarPasoActual()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                validarPasoActual()
                  ? "bg-principal text-white hover:bg-principal-dark"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !validarPasoActual()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isSubmitting || !validarPasoActual()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-verde text-white hover:bg-verde-dark"
              }`}
            >
              {isSubmitting ? "Creando Póliza..." : "Crear Póliza"}
            </button>
          )}
        </div>
      </div>

      {/* Botón de reiniciar (solo en desarrollo)
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 text-center">
          <button
            onClick={reiniciarFormulario}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            🔄 Reiniciar Formulario (Solo Desarrollo)
          </button>
        </div> 
      )}

      {/* Debug info (solo en desarrollo) */}
      {/* {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <details>
            <summary className="font-bold cursor-pointer">
              🐛 Debug Info (Solo Desarrollo)
            </summary>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </details>
        </div>
      )} */}
    </div>
  );
}
