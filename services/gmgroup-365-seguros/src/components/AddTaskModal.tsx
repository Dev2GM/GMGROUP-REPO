import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

interface TaskForm {
  titulo: string;
  descripcion: string;
  id_creador: string;
  id_asignado: string;
  prioridad: string;
  estado: string;
  fecha_vencimiento: string;
}

interface AddTaskModalType {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: (task: TaskForm) => void;
  selectedTarea: any | null
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onTaskAdded,
  selectedTarea
}: AddTaskModalType) {
  const [form, setForm] = useState<TaskForm>({
    titulo: '',
    descripcion: '',
    id_creador: '',
    id_asignado: '',
    prioridad: 'Media',
    estado: 'Pendiente',
    fecha_vencimiento: ''
  });

  useEffect(() => {
    if (selectedTarea) {
      setForm({
        titulo: selectedTarea.titulo,
        descripcion: selectedTarea.descripcion || '',
        id_creador: `${selectedTarea.id_creador}`,
        id_asignado: `${selectedTarea.id_asignado}`,
        prioridad: selectedTarea.prioridad,
        estado: selectedTarea.estado,
        fecha_vencimiento: selectedTarea.fecha_vencimiento || ''
      })
    }
  }, [selectedTarea])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (selectedTarea) {
      const res = await fetch('http://localhost:5000/tarea/update/' + selectedTarea.id_tarea, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const data = await res.json();
        onTaskAdded(data);
        onClose();
      }
    } else {
      const res = await fetch('http://localhost:5000/tarea/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
  
      if (res.ok) {
        const data = await res.json();
        onTaskAdded(data);
        onClose();
      }
    }

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Agregar Tarea</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="titulo"
            placeholder="Título"
            onChange={handleChange}
            className="border p-2"
            value={form.titulo}
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            onChange={handleChange}
            className="border p-2"
            value={form.descripcion}
          />
          <input
            name="id_creador"
            placeholder="Creador"
            onChange={handleChange}
            className="border p-2"
            value={form.id_creador}
            />
          <input
            name="id_asignado"
            placeholder="Asignado a:"
            onChange={handleChange}
            className="border p-2"
            value={form.id_asignado}
          />
          <select
            name="prioridad"
            onChange={handleChange}
            value={form.prioridad}
            className="border p-2"
          >
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>
          <select
            name="estado"
            onChange={handleChange}
            value={form.estado}
            className="border p-2"
          >
            <option>Pendiente</option>
            <option>En Proceso</option>
            <option>Completada</option>
            <option>Rechazada</option>
          </select>
          <input
            type="date"
            name="fecha_vencimiento"
            onChange={handleChange}
            className="border p-2"
            value={form.fecha_vencimiento}
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}