import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import API from "@/api/api";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

interface ConocimientoBotItem {
  id: number;
  pregunta: string;
  respuesta_correcta: string;
  respuesta_erronea?: string;
}

const ConocimientoBot: React.FC = () => {
  const [items, setItems] = useState<ConocimientoBotItem[]>([]);
  const [pregunta, setPregunta] = useState("");
  const [respuestaCorrecta, setRespuestaCorrecta] = useState("");
  const [respuestaErronea, setRespuestaErronea] = useState("");

  // Obtener preguntas al cargar
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await API.get("/api/conocimiento_bot");
        if (response.status === 200) {
          setItems(response.data.items);
        }
      } catch (error) {
        console.error("Error al obtener preguntas:", error);
      }
    };
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (!pregunta.trim() || !respuestaCorrecta.trim()) return;
    try {
      const response = await API.post("/api/conocimiento_bot", {
        pregunta,
        respuesta_correcta: respuestaCorrecta,
        respuesta_erronea: respuestaErronea || null,
      });
      if (response.status === 201) {
        // Recargar lista
        const res = await API.get("/api/conocimiento_bot");
        setItems(res.data.items);
        setPregunta("");
        setRespuestaCorrecta("");
        setRespuestaErronea("");
      }
    } catch (error) {
      console.error("Error al agregar pregunta:", error);
      alert("Hubo un error al agregar la pregunta.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await API.delete(`/api/conocimiento_bot/${id}`);
      if (response.status === 200) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar pregunta:", error);
      alert("Hubo un error al eliminar la pregunta.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-8 text-center flex items-center justify-center gap-2">
          <HelpCircle className="w-8 h-8 text-blue-600" /> Conocimiento Bot
        </h1>
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Agregar nueva pregunta</h2>
          <div className="space-y-5">
            <Input
              id="pregunta"
              name="pregunta"
              type="text"
              label="Pregunta"
              placeholder="Escribe la pregunta"
              value={pregunta}
              onChange={e => setPregunta(e.target.value)}
              className="mb-2 px-4 py-2 border border-gray-300 rounded-lg w-full"
            />
            <Input
              id="respuestaCorrecta"
              name="respuestaCorrecta"
              type="text"
              label="Respuesta Correcta"
              placeholder="Escribe la respuesta correcta"
              value={respuestaCorrecta}
              onChange={e => setRespuestaCorrecta(e.target.value)}
              className="mb-2 px-4 py-2 border border-green-300 rounded-lg w-full"
            />
            <Input
              id="respuestaErronea"
              name="respuestaErronea"
              type="text"
              label="Respuesta Errónea"
              placeholder="Escribe la respuesta errónea (opcional)"
              value={respuestaErronea}
              onChange={e => setRespuestaErronea(e.target.value)}
              className="mb-2 px-4 py-2 border border-red-300 rounded-lg w-full"
            />
            <Button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg w-full font-semibold shadow-md transition-transform hover:scale-105"
            >
              Agregar pregunta
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.length > 0 ? (
            items.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 flex flex-col gap-3 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-6 h-6 text-blue-500" />
                  <h2 className="text-lg font-bold text-gray-800">{item.pregunta}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">{item.respuesta_correcta}</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 font-medium">{item.respuesta_erronea || <span className="italic text-gray-400">Sin respuesta errónea</span>}</span>
                </div>
                <Button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mt-2 font-semibold shadow-sm transition-transform hover:scale-105"
                >
                  Eliminar
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-2 text-center">No hay registros aún.</p>
          )}
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
};

export default ConocimientoBot;
