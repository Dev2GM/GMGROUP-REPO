import { useEffect, useState } from "react";
import API from "@/api/api";
import { Plus, Home, Users, Calendar, MessageSquare } from "lucide-react";
import CrearTareaForm from "./calendario/crearTarea";
import type { Tarea, TareasKanban } from "@/types/Tareas";


const Kanban = () => {
  const [currentView, setCurrentView] = useState("assigned"); // 'assigned' o 'created'
  const [tareas, setTareas] = useState<TareasKanban>({
        pendientes: [],
        proceso: [],
        completadas: [],
        rechazadas: []
      })
    const [dataCompleta, setDataCompleta] = useState<Tarea[]>([]);
    const [currentTarea, setCurrentTarea] = useState<Tarea | null>(null)
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  const toggleView = () => {
    setCurrentView(currentView === "assigned" ? "created" : "assigned");
  };

    useEffect(() => {
        const cargarTareas = async () => {
            try {
              const response = await API.get("/api/tareas");
              // const data = await getTareas();
              setDataCompleta(response.data);

              const columnas: TareasKanban = {
                  pendientes: [],
                  proceso: [],
                  completadas: [],
                  rechazadas: []
              };

              response.data.forEach((tarea:Tarea) => {

                  switch (tarea.estado?.toLowerCase()) {
                    case 'pendiente':
                        columnas.pendientes.push(tarea);
                        break;
                    case 'en proceso':
                        columnas.proceso.push(tarea);
                        break;
                    case 'completada':
                        columnas.completadas.push(tarea);
                        break;
                    case 'rechazada':
                        columnas.rechazadas.push(tarea);
                        break;
                    default:
                        columnas.pendientes.push(tarea);
                  }
              });

              setTareas(columnas);
            } catch (error) {
              console.error("Error al cargar tareas:", error);
              setTareas({ pendientes: [], proceso: [], completadas: [], rechazadas: [] });
            }
        };

        cargarTareas();
    }, []);


  const getViewConfig = () => {
    if (currentView === "assigned") {
      return {
        title: "Tareas asignadas para mí",
        filterLabel: "Filtrar por Creador",
        buttonText: "Ver tareas creadas por mí",
      };
    } else {
      return {
        title: "Tareas creadas por mí",
        filterLabel: "Filtrar por Usuario",
        buttonText: "Ver tareas asignadas para mí",
      };
    }
  };

  const config = getViewConfig();

  const handleSaveTarea = async (data:Tarea) => {
      const response = await API.put("/api/tareas/" + currentTarea?.id, {
        ...data
      });
      window.location.reload()
  }

  const TaskColumn = ({
    title,
    color,
    items,
    bgColor,
  }: {
    title: string;
    color: string;
    items: Tarea[];
    bgColor: string;
  }) => (
    <div className="flex-1 bg-white rounded-lg shadow-sm">
      <div className={`${bgColor} ${color} px-4 py-3 rounded-t-lg`}>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <div className="p-4 min-h-[500px]">
        <div className="space-y-3">
          {items.map((task:Tarea) => {
            let color = "text-gray-600";
            if (task.prioridad == "media") {
              color = "text-yellow-500"
            } else if (task.prioridad == "alta") {
              color = "text-red-500";
            }
            return <div
              key={task.id}
              className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => {
                setShowCreateForm(true)
                setCurrentTarea(task)
              }}
            >
              <h4 className="font-medium text-gray-800 mb-2">{task.titulo}</h4>
              <p className={`text-sm ${color}`}>
                Priodidad {task.prioridad}
              </p>
              <p className="text-sm text-gray-600">
                {currentView === "assigned"
                  ? `Creado por: ${task.id_creador}`
                  : `Asignado a: ${task.id_asignado}`}
              </p>
            </div>
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onTaskAdded={handleTaskAdded}
        selectedTarea={currentTarea}
      /> */}
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-8 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              {config.title}
            </h1>

            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">
                {config.filterLabel}
              </span>
              <input
                type="text"
                placeholder=""
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
          </div>

          {/* <button onClick={() => setModalOpen(true)}
           className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Plus className="w-4 h-4" />
            <span>Crear tarea</span>
          </button> */}
        </div>

        {/* Columnas de tareas */}
        <div className="flex-1 p-8">
          <div className="flex space-x-6 h-full">
            <TaskColumn
              title="Pendientes"
              color="text-white"
              bgColor="bg-orange-500"
              items={tareas.pendientes}
            />
            <TaskColumn
              title="En proceso"
              color="text-white"
              bgColor="bg-blue-500"
              items={tareas.proceso}
            />
            <TaskColumn
              title="Completadas"
              color="text-white"
              bgColor="bg-green-500"
              items={tareas.completadas}
            />
            <TaskColumn
              title="Rechazadas"
              color="text-white"
              bgColor="bg-red-500"
              items={tareas.rechazadas}
            />
          </div>
        </div>

        {/* Botón de intercambio en la esquina inferior derecha */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={toggleView}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium shadow-lg transition-colors"
          >
            {config.buttonText}
          </button>
        </div>

        {showCreateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Crear Nueva Tarea</h3>
                <CrearTareaForm
                  isOpen={showCreateForm}
                  onClose={() => setShowCreateForm(false)}
                  onSave={handleSaveTarea}
                  selectedTarea={currentTarea}
                  selectedDate={currentTarea?new Date(currentTarea.fecha) : null}
                />
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Kanban;