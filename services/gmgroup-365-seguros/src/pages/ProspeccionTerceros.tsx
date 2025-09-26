
import { useState, useEffect } from "react";
import { Plus, Users } from "lucide-react";
import AddProspeccionModal from "@/components/AddProspeccionModal";
import API from "@/api/api";

type KanbanTask = {
  id: number;
  persona: {
    id: number;
    nombres: string;
    apellidos: string;
    documento: string;
    telefono: string;
    email: string;
  };
  usuario: {
    id: number;
    nombres: string;
    apellidos: string;
    username: string;
  };
  creador: {
    id: number;
    nombres: string;
    apellidos: string;
    username: string;
  };
  estado: string;
};

type KanbanColumns = {
  asignado: KanbanTask[];
  primer_llamado: KanbanTask[];
  seguimiento: KanbanTask[];
  contrata: KanbanTask[];
  no_contrata: KanbanTask[];
};

const initialColumns: KanbanColumns = {
  asignado: [],
  primer_llamado: [],
  seguimiento: [],
  contrata: [],
  no_contrata: []
};


export default function ProspeccionTerceros() {
  const [columns, setColumns] = useState<KanbanColumns>(initialColumns);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const moveTask = (from: keyof KanbanColumns, to: keyof KanbanColumns, idx: number) => {
    const task = columns[from][idx];
    setColumns(prev => ({
      ...prev,
      [from]: prev[from].filter((_, i) => i !== idx),
      [to]: [...prev[to], { ...task, estado: to }]
    }));
    API.put(`/api/prospeccion/${task.id}`, { estado: to }).catch(() => {});
  };

  const columnConfig: { key: keyof KanbanColumns; label: string; bg: string }[] = [
    { key: "asignado", label: "Asignado", bg: "bg-blue-500" },
    { key: "primer_llamado", label: "Primer llamado", bg: "bg-yellow-500" },
    { key: "seguimiento", label: "Seguimiento", bg: "bg-purple-500" },
    { key: "contrata", label: "Contrata", bg: "bg-green-500" },
    { key: "no_contrata", label: "No contrata", bg: "bg-red-500" },
  ];

  const handleAddProspeccion = async ({ id_persona, id_usuario }: { id_persona: number; id_usuario: number }) => {
    try {
      const res = await API.post("/api/prospeccion", {
        id_persona,
        id_usuario,
        estado: "asignado"
      });
      window.location.reload();
    } catch (err) {
      // Manejo de error
    }
  };

  useEffect(() => {
    const fetchProspecciones = async () => {
      setLoading(true);
      try {
        const res = await API.get("/api/prospeccion");
        const data: KanbanTask[] = res.data;
        const agrupado: KanbanColumns = {
          asignado: [],
          primer_llamado: [],
          seguimiento: [],
          contrata: [],
          no_contrata: []
        };
        data.forEach(p => {
          const estadoKey = p.estado as keyof KanbanColumns;
          if (estadoKey in agrupado) agrupado[estadoKey].push(p);
        });
        setColumns(agrupado);
      } catch (err) {
        setColumns(initialColumns);
      }
      setLoading(false);
    };
    fetchProspecciones();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <AddProspeccionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddProspeccion}
      />
      <div className="flex-1 flex flex-col bg-white">
        <div className="h-20 flex items-center px-8 bg-white border-b border-gray-200 justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
            <Users size={24} className="mr-2" /> Kanban - Prospección de Terceros
          </h1>
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow transition-colors"
            onClick={() => setModalOpen(true)}
          >
            <Plus size={20} /> Agregar Prospección
          </button>
        </div>
        <div className="flex-1 p-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400 text-lg">Cargando prospecciones...</span>
            </div>
          ) : (
            <div className="flex space-x-6 h-full">
              {columnConfig.map(col => (
                <div key={col.key} className="flex-1 bg-white rounded-lg shadow-sm flex flex-col">
                  <div className={`${col.bg} px-4 py-3 rounded-t-lg`}>
                    <h3 className="font-semibold text-white">{col.label}</h3>
                  </div>
                  <div className="p-4 min-h-[400px] flex-1">
                    <ul className="space-y-2">
                      {columns[col.key].map((task: KanbanTask, idx: number) => (
                        <li key={task.id || idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow cursor-pointer flex flex-col gap-3 relative">
                          {/* Flecha/acciones arriba a la derecha */}
                          <div className="absolute top-3 right-3 flex gap-1">
                            {col.key !== "asignado" && (
                              <button onClick={() => moveTask(col.key, "asignado", idx)} className="text-blue-500 bg-blue-100 rounded-full p-1 hover:bg-blue-200 transition" title="Mover a Asignado">←</button>
                            )}
                            {col.key === "asignado" && (
                              <button onClick={() => moveTask(col.key, "primer_llamado", idx)} className="text-yellow-500 bg-yellow-100 rounded-full p-1 hover:bg-yellow-200 transition" title="Primer llamado">→</button>
                            )}
                            {col.key === "primer_llamado" && (
                              <button onClick={() => moveTask(col.key, "seguimiento", idx)} className="text-purple-500 bg-purple-100 rounded-full p-1 hover:bg-purple-200 transition" title="Seguimiento">→</button>
                            )}
                            {col.key === "seguimiento" && (
                              <>
                                <button onClick={() => moveTask(col.key, "contrata", idx)} className="text-green-500 bg-green-100 rounded-full p-1 hover:bg-green-200 transition" title="Contrata">✔</button>
                                <button onClick={() => moveTask(col.key, "no_contrata", idx)} className="text-red-500 bg-red-100 rounded-full p-1 hover:bg-red-200 transition" title="No contrata">✖</button>
                              </>
                            )}
                          </div>
                          {/* Nombre y documento */}
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-md text-primary mb-1">{task.persona.nombres} {task.persona.apellidos}</span>
                              <span className="text-xs text-gray-500">Documento: {task.persona.documento}</span>
                            </div>
                          </div>
                          {/* Datos de contacto */}
                          <div className="flex flex-col gap-1 mt-1">
                            <div className="flex items-center gap-2 text-gray-700">
                              <span className="font-semibold">Tel:</span>
                              <span>{task.persona.telefono}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <span className="font-semibold">Email:</span>
                              <span>{task.persona.email}</span>
                            </div>
                          </div>
                          {/* Usuario asignado y creador */}
                          <div className="flex flex-col gap-1 mt-2">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span className="font-semibold text-blue-700">Asignado:</span>
                              <span>{task.usuario.nombres} {task.usuario.apellidos}</span>
                              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">{task.usuario.username}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span className="font-semibold text-green-700">Creador:</span>
                              <span>{task.creador.nombres} {task.creador.apellidos}</span>
                              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">{task.creador.username}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
