import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, User, Tag, AlertCircle } from "lucide-react";
import API from "@/api/api";

import type { Tarea } from "@/types/Tareas";

import Swal from "sweetalert2";
import type { Usuario } from "@/types/auth";


interface CrearTareaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tarea: any) => void;
  selectedDate?: Date | null; // Acepta Date o null
  selectedTarea?: Tarea | null
}

export default function CrearTareaForm({
    isOpen,
    onClose,
    onSave,
    selectedDate = null,
    selectedTarea = null
  }: CrearTareaFormProps) {
  const initialFormData: Tarea = {
    titulo: "",
    descripcion: "",
    fecha: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
    hora_inicio: "",
    hora_fin: "",
    prioridad: "media",
    id_categoria: 0,
    id_asignado: 0,
    recordatorio: "15", // minutos antes
    notas: "",
    estado: ""
  };

  const [categoriaOptions, setCategoriasOptions] = useState<any[]>([])
  const [usuariosOptions, setUsuariosOptions] = useState<any[]>([])
  const [formData, setFormData] = useState<Tarea>(selectedTarea ?? initialFormData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Tarea, string>>
  >({});

  // Efecto para resetear la fecha si selectedDate cambia (útil si el componente se reutiliza)
  useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        fecha: selectedDate.toISOString().split("T")[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        fecha: "",
      }));
    }
  }, [selectedDate]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const response = await API.get("/api/tareas/categorias");
      
      if (response.status === 200) {
        const categorias = response.data.data;
        setCategoriasOptions(categorias.map((c:any) => {
          return {value: c.id, label: c.nombre}
        }))
      }

    }
    fetchCategorias()
  }, [])
  
  useEffect(() => {
    const fetchUsuarios = async () => {
      const response = await API.get("/api/users");
      
      if (response.status === 200) {
        console.log(response.data)
        const usuarios = response.data.users;
        setUsuariosOptions(usuarios.map((c:Usuario) => {
          return {value: c.id, label: c.nombres + " " + c.apellidos + " - " + c.username}
        }))
      }

    }
    fetchUsuarios()
  }, [])

  const prioridadOptions = [
    { value: "baja", label: "Baja", color: "bg-green-100 text-green-800" },
    { value: "media", label: "Media", color: "bg-yellow-100 text-yellow-800" },
    { value: "alta", label: "Alta", color: "bg-red-100 text-red-800" },
  ];


  const recordatorioOptions = [
    { value: "0", label: "En el momento" },
    { value: "5", label: "5 minutos antes" },
    { value: "15", label: "15 minutos antes" },
    { value: "30", label: "30 minutos antes" },
    { value: "60", label: "1 hora antes" },
    { value: "1440", label: "1 día antes" },
  ];
  
  const estadosOptions = [
    { value: "Pendiente", label: "Pendiente" },
    { value: "En Proceso", label: "En Proceso" },
    { value: "Completada", label: "Completada" },
    { value: "Rechazada", label: "Rechazada" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error específico si existe al cambiar el campo
    if (errors[name as keyof Tarea]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Partial<Record<keyof Tarea, string>> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es obligatorio.";
    }

    if (!formData.fecha) {
      newErrors.fecha = "La fecha es obligatoria.";
    }

    if (!formData.hora_inicio) {
      newErrors.hora_inicio = "La hora de inicio es obligatoria.";
    }

    // Validación de horas:
    if (formData.hora_inicio && formData.hora_fin) {
      if (formData.hora_fin <= formData.hora_inicio) {
        newErrors.hora_fin = "La hora de fin debe ser posterior a la de inicio.";
      }
    }

    // Mostrar error con Swal si existe
    if (newErrors.id_asignado) {
      Swal.fire("Error", "El usuario " + formData.id_asignado + " no existe", "error");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    if (await validateForm()) {
      onSave(formData);
      handleReset(); // Resetear el formulario después de guardar
      onClose();
    }
  };

  const handleReset = () => {
    setFormData(initialFormData); // Usa el estado inicial para resetear
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Crear Nueva Tarea
          </h2>
          <button
            type="button" // Es buena práctica especificar el tipo
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar formulario" // Mejora de accesibilidad
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {" "}
          {/* Usa la etiqueta form y onSubmit */}
          <div className="p-6 space-y-6">
            {/* Información básica */}
            <section className="space-y-4">
              {" "}
              {/* Usa section para agrupar contenido */}
              <h3 className="text-lg font-medium text-gray-700 border-b pb-2">
                Información básica
              </h3>
              {/* Título */}
              <div>
                <label
                  htmlFor="titulo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Título de la tarea *
                </label>
                <input
                  type="text"
                  id="titulo" // Asociar label con input
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.titulo ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ej: Reunión con cliente importante"
                  aria-invalid={errors.titulo ? "true" : "false"} // Mejora de accesibilidad
                  aria-describedby="titulo-error" // Para asociar el mensaje de error
                />
                {errors.titulo && (
                  <p
                    id="titulo-error"
                    className="text-red-500 text-xs mt-1 flex items-center"
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.titulo}
                  </p>
                )}
              </div>
              {/* Descripción */}
              <div>
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe los detalles de la tarea..."
                />
              </div>
            </section>

            {/* Fecha y hora */}
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 border-b pb-2">
                Fecha y hora
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Fecha */}
                <div>
                  <label
                    htmlFor="fecha"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Fecha *
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    value={formData.fecha.split("T")[0]}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.fecha ? "border-red-500" : "border-gray-300"
                    }`}
                    aria-invalid={errors.fecha ? "true" : "false"}
                    aria-describedby="fecha-error"
                  />
                  {errors.fecha && (
                    <p
                      id="fecha-error"
                      className="text-red-500 text-xs mt-1 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.fecha}
                    </p>
                  )}
                </div>

                {/* Hora inicio */}
                <div>
                  <label
                    htmlFor="horaInicio"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hora inicio *
                  </label>
                  <input
                    type="time"
                    id="hora_inicio"
                    name="hora_inicio"
                    value={formData.hora_inicio}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.hora_inicio ? "border-red-500" : "border-gray-300"
                    }`}
                    aria-invalid={errors.hora_inicio ? "true" : "false"}
                    aria-describedby="horaInicio-error"
                  />
                  {errors.hora_inicio && (
                    <p
                      id="horaInicio-error"
                      className="text-red-500 text-xs mt-1 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.hora_inicio}
                    </p>
                  )}
                </div>

                {/* Hora fin */}
                <div>
                  <label
                    htmlFor="horaFin"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hora fin
                  </label>
                  <input
                    type="time"
                    id="hora_fin"
                    name="hora_fin"
                    value={formData.hora_fin}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.hora_fin ? "border-red-500" : "border-gray-300"
                    }`}
                    aria-invalid={errors.hora_fin ? "true" : "false"}
                    aria-describedby="horaFin-error"
                  />
                  {errors.hora_fin && (
                    <p
                      id="horaFin-error"
                      className="text-red-500 text-xs mt-1 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.hora_fin}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Configuración */}
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 border-b pb-2">
                Configuración
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Prioridad */}
                <div>
                  <label
                    htmlFor="prioridad"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Prioridad
                  </label>
                  <select
                    id="prioridad"
                    name="prioridad"
                    value={formData.prioridad}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {prioridadOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Categoría */}
                <div>
                  <label
                    htmlFor="categoria"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Categoría
                  </label>
                  <select
                    id="id_categoria"
                    name="id_categoria"
                    value={formData.id_categoria}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categoriaOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Asignado a */}
                <div>
                  <label
                    htmlFor="categoria"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Asignado a:
                  </label>
                  <select
                    id="id_asignado"
                    name="id_asignado"
                    value={formData.id_asignado}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar usuario asignado</option>
                    {usuariosOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recordatorio */}
                <div>
                  <label
                    htmlFor="recordatorio"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Recordatorio
                  </label>
                  <select
                    id="recordatorio"
                    name="recordatorio"
                    value={formData.recordatorio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {recordatorioOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Notas adicionales */}
            <section>
              <label
                htmlFor="notas"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notas adicionales
              </label>
              <textarea
                id="notas"
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Información adicional, enlaces, contactos..."
              />
            </section>
            
            {/* Estado */}
            {selectedTarea && <section>
              <label
                htmlFor="estado"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar estado</option>
                {estadosOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </section>}
            

            {/* Vista previa de prioridad */}
            {formData.prioridad && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Prioridad seleccionada:
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    prioridadOptions.find((p) => p.value === formData.prioridad)
                      ?.color
                  }`}
                >
                  {
                    prioridadOptions.find((p) => p.value === formData.prioridad)
                      ?.label
                  }
                </span>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit" // Cambiado a type="submit" para que el formulario lo maneje
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Crear Tarea
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
