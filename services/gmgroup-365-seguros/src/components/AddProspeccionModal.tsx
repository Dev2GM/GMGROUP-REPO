
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import API from "@/api/api";

type Persona = {
  id: number;
  nombres: string;
  apellidos: string;
  documento: string;
  telefono: string;
  email: string;
};

type Usuario = {
  id: number;
  nombres: string;
  apellidos: string;
  username: string;
};

interface AddProspeccionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: { id_persona: number; id_usuario: number }) => Promise<void>;
}

export default function AddProspeccionModal({ open, onClose, onAdd }: AddProspeccionModalProps) {
  const [search, setSearch] = useState<string>("");
  const [corredor, setCorredor] = useState<string>("");
  const [corredores, setCorredores] = useState<{ id: number; nombre: string }[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioAsignado, setUsuarioAsignado] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Buscar personas
  const handleBuscar = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/personas/buscar", {
        params: { id_corredor: corredor, q: search }
      });
      setPersonas(res.data);
    } catch (err) {
      setPersonas([]);
    }
    setLoading(false);
  };

  // Buscar usuarios
  const fetchUsuarios = async () => {
    try {
      const res = await API.get("/api/users");
      setUsuarios(res.data.users || []);
    } catch (err) {
      setUsuarios([]);
    }
  };

  // Buscar corredores
  const fetchCorredores = async () => {
    try {
      const res = await API.get("/api/corredores");
      setCorredores(res.data || []);
    } catch (err) {
      setCorredores([]);
    }
  };

  // Cargar usuarios y corredores al abrir
  useEffect(() => {
    if (open) {
      fetchUsuarios();
      fetchCorredores();
    }
  }, [open]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPersona || !usuarioAsignado) return;
    await onAdd({ id_persona: selectedPersona.id, id_usuario: Number(usuarioAsignado) });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-gray-200 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-primary">Agregar Prospección</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">Corredor</label>
            <select
              value={corredor}
              onChange={e => setCorredor(e.target.value)}
              className="w-full px-4 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-all bg-gray-50 text-gray-800 font-semibold shadow-sm hover:border-primary"
            >
              <option value="">Selecciona corredor</option>
              {corredores.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">Buscar persona</label>
            <div className="flex gap-2">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cédula, nombre, teléfono, email..."
                className="flex-1 px-4 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-all bg-gray-50 text-gray-800 font-semibold shadow-sm hover:border-primary"
              />
              <Button type="button" onClick={handleBuscar} disabled={loading} className="!px-6 !py-2 !rounded-lg !font-bold !bg-primary !text-white hover:!bg-primary-dark transition-all">Buscar</Button>
            </div>
          </div>
          {personas.length > 0 && (
            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-700">Selecciona persona</label>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {personas.map(p => (
                  <li key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-all">
                    <input
                      type="radio"
                      name="persona"
                      value={p.id}
                      checked={selectedPersona?.id === p.id}
                      onChange={() => setSelectedPersona(p)}
                      className="accent-primary w-4 h-4"
                    />
                    <span className="text-gray-800 font-medium">
                      {p.nombres} {p.apellidos} <span className="text-xs text-gray-500">({p.documento})</span><br />
                      <span className="text-xs text-gray-500"><b>Tel:</b> {p.telefono} - <b>Email:</b> {p.email}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">Asignar usuario</label>
            <select
              value={usuarioAsignado}
              onChange={e => setUsuarioAsignado(e.target.value)}
              className="w-full px-4 py-2 border-2 border-primary/30 rounded-lg focus:outline-none focus:border-primary transition-all bg-gray-50 text-gray-800 font-semibold shadow-sm hover:border-primary"
            >
              <option value="">Selecciona usuario</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>{u.nombres} {u.apellidos} ({u.username})</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" onClick={onClose} variant="secondary" className="!px-6 !py-2 !rounded-lg !font-bold">Cancelar</Button>
            <Button type="submit" disabled={!selectedPersona || !usuarioAsignado} className="!px-6 !py-2 !rounded-lg !font-bold !bg-primary !text-white hover:!bg-primary-dark transition-all">Agregar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
