import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar } from "lucide-react";
import CrearTareaForm from "./calendario/crearTarea";
import API from "@/api/api";

import type { Tarea } from "@/types/Tareas";

interface DayInfo {
  date: Date;
  isCurrentMonth: boolean;
}

const CalendarInterface: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // Junio 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [tareas, setTareas] = useState<any[]>([]);

  const months: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const daysOfWeek: string[] = [
    "DOM",
    "LUN",
    "MAR",
    "MIE",
    "JUE",
    "VIE",
    "SAB",
  ];

  const getDaysInMonth = (date: Date): DayInfo[] => {
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    const firstDay: Date = new Date(year, month, 1);
    const lastDay: Date = new Date(year, month + 1, 0);
    const daysInMonth: number = lastDay.getDate();
    const startingDayOfWeek: number = firstDay.getDay();

    const days: DayInfo[] = [];

    // Días del mes anterior para completar la primera semana
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate: Date = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }

    // Días del mes siguiente para completar la grilla
    const remainingDays: number = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const navigateMonth = (direction: number): void => {
    const newDate: Date = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date: Date): boolean => {
    const today: Date = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleSaveTarea = async (nuevaTarea: any) => {
    setTareas((prev) => [...prev, nuevaTarea]);
    const response = await API.post("/api/tareas", {
        ...nuevaTarea, 
      }, 
    ) 
    console.log(response)
    console.log("Nueva tarea creada:", nuevaTarea);
  };

  const getTareasForDate = (date: Date): Tarea[] => {
    const dateString = date.toISOString().split("T")[0];
    return tareas.filter((tarea) => tarea.fecha.split("T")[0] === dateString);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchTareas = async () => {
      const response = await API.get("/api/tareas");
      if (response.status === 200) {
        console.log(response.data)
        setTareas(response.data)
      }
    }
    fetchTareas()
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex bg-white">
        <div className="flex-1 flex flex-col">
          <div className="h-20 flex items-center justify-between px-8 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-semibold text-gray-800">
                Agenda mensual
              </h1>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  type="button"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <h2 className="text-xl font-medium text-gray-800 min-w-[140px] text-center">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>

                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  type="button"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              type="button"
            >
              <Plus className="w-4 h-4" />
              <span>Crear tarea</span>
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {daysOfWeek.map((day: string) => (
              <div key={day} className="p-4 text-center">
                <span className="text-sm font-semibold text-gray-700">
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* Grilla del calendario */}
          <div
            className="flex-1 grid grid-cols-7"
            style={{ gridTemplateRows: "repeat(6, 1fr)" }}
          >
            {getDaysInMonth(currentDate).map((day: DayInfo, index: number) => {
              const tareasDelDia = getTareasForDate(day.date);

              return (
                <div
                  key={index}
                  className={`border-r border-b border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors min-h-[120px] ${
                    !day.isCurrentMonth ? "bg-gray-50" : "bg-white"
                  } ${
                    selectedDate?.toDateString() === day.date.toDateString()
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <div
                    className={`text-sm mb-2 ${
                      day.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    } ${isToday(day.date) ? "font-bold" : ""}`}
                  >
                    <span
                      className={`inline-block w-6 h-6 text-center rounded-full ${
                        isToday(day.date) ? "bg-blue-500 text-white" : ""
                      }`}
                    >
                      {day.date.getDate()}
                    </span>
                  </div>

                  {/* Tareas del día */}
                  <div className="space-y-1">
                    {tareasDelDia.slice(0, 3).map((tarea: Tarea) => (
                      <div
                        key={tarea.id}
                        className={`text-xs p-1 rounded truncate ${
                          tarea.prioridad === "alta"
                            ? "bg-red-100 text-red-800"
                            : tarea.prioridad === "media"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                        title={`${tarea.hora_inicio} - ${tarea.titulo}`}
                      >
                        {tarea.hora_inicio} {tarea.titulo}
                      </div>
                    ))}
                    {tareasDelDia.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{tareasDelDia.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel derecho - Actividades del día */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Actividades del día
          </h3>

          {selectedDate ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                {formatDate(selectedDate)}
              </div>

              {getTareasForDate(selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {getTareasForDate(selectedDate).map((tarea: Tarea) => (
                    <div
                      key={tarea.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {tarea.titulo}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            tarea.prioridad === "alta"
                              ? "bg-red-100 text-red-800"
                              : tarea.prioridad === "media"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {tarea.prioridad}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 mb-2">
                        {tarea.hora_inicio}
                        {tarea.hora_fin && ` - ${tarea.hora_fin}`}
                      </div>

                      {tarea.descripcion && (
                        <p className="text-sm text-gray-700 mb-2">
                          {tarea.descripcion}
                        </p>
                      )}

                      {tarea.id_categoria && (
                        <div className="text-xs text-gray-500">
                          Categoría: {tarea.id_categoria}
                        </div>
                      )}

                      {tarea.id_asignado && (
                        <div className="text-xs text-gray-500">
                          Asignado a: {tarea.id_asignado}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm">No hay actividades para este día</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="text-xs text-blue-500 hover:text-blue-600 mt-2"
                    type="button"
                  >
                    Crear nueva tarea
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm">Selecciona un día para ver las tareas</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal del formulario - aquí importarías tu componente CrearTareaForm */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Crear Nueva Tarea</h3>
            <CrearTareaForm
              isOpen={showCreateForm}
              onClose={() => setShowCreateForm(false)}
              onSave={handleSaveTarea}
              selectedDate={selectedDate}
            />
            {/* <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                type="button"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Simulación de crear tarea
                  const nuevaTarea: Tarea = {
                    id: Date.now(),
                    titulo: "Tarea de ejemplo",
                    fecha: selectedDate
                      ? selectedDate.toISOString().split("T")[0]
                      : new Date().toISOString().split("T")[0],
                    hora_inicio: "10:00",
                    prioridad: "media",
                    recordatorio: "15",
                    // fecha: new Date().toISOString(),
                    completada: false,
                  };
                  handleSaveTarea(nuevaTarea);
                  setShowCreateForm(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                type="button"
              >
                Crear
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarInterface;