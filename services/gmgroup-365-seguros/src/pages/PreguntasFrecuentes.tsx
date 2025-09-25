import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button"; 
import Input from "@/components/ui/Input";  
import API from "@/api/api";

interface Pregunta {
  id: number;
  pregunta: string;
  respuesta?: string;
}

const PreguntasFrecuentes: React.FC = () => {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUnanswered, setShowUnanswered] = useState(false);

  // Estado para modal

  const [showModalWithAnswer, setShowModalWithAnswer] = useState(false);
  const [showModalWithoutAnswer, setShowModalWithoutAnswer] = useState(false);

  const [newPregunta, setNewPregunta] = useState("");
  const [newRespuesta, setNewRespuesta] = useState("");

  // Estado de carga para guardar pregunta
  const [loadingAddWithAnswer, setLoadingAddWithAnswer] = useState(false);
  const [loadingAddWithoutAnswer, setLoadingAddWithoutAnswer] = useState(false);

    // Obtener todas las preguntas al cargar la página
    useEffect(() => {
      const fetchPreguntas = async () => {
        setLoading(true);
        try {
          const response = await API.get("/api/faq"); // Ajusta el endpoint si es diferente
          if (response.status !== 200) throw new Error("Error al obtener preguntas");
          const data = response.data;
          const resultados: Pregunta[] = data.preguntas.map(
            (item: any, index: number) => ({
              id: index + 1,
              pregunta: item.pregunta,
              respuesta: item.respuesta,
            })
          );
          setPreguntas(resultados);
        } catch (error) {
          console.error("Error obteniendo preguntas:", error);
          alert("Hubo un error al obtener las preguntas.");
        }
        setLoading(false);
      };
      fetchPreguntas();
    }, []);

  

  const handleSearch = async () => {
    setLoadingSearch(true);
    if (!searchTerm.trim()) {
      try {
        const response = await API.get("/api/faq"); // Ajusta el endpoint si es diferente
        if (response.status !== 200) throw new Error("Error al obtener preguntas");
        const data = response.data;
        const resultados: Pregunta[] = data.preguntas.map(
          (item: any, index: number) => ({
            id: index + 1,
            pregunta: item.pregunta,
            respuesta: item.respuesta,
          })
        );
        setPreguntas(resultados);
      } catch (error) {
        console.error("Error obteniendo preguntas:", error);
        alert("Hubo un error al obtener las preguntas.");
      }
      setLoadingSearch(false);
      return;
    }

    try {
      const response = await API.post("/api/faq/buscar", { texto: searchTerm });
      if (response.status !== 200) throw new Error("Error al buscar preguntas");

      const data = response.data;
      const resultados: Pregunta[] = data.resultados.map(
        (item: any, index: number) => ({
          id: index + 1,
          pregunta: item.pregunta,
          respuesta: item.respuesta,
        })
      );

      setPreguntas(resultados);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      alert("Hubo un error al buscar preguntas.");
    }
    setLoadingSearch(false);
  };

  const handleSaveWithAnswer = async () => {
    if (newPregunta.trim()) {
      setLoadingAddWithAnswer(true);
      try {
        const response = await API.post("/api/faq", {
          pregunta: newPregunta,
          respuesta: newRespuesta || "",
        });

        if (response.status !== 200) throw new Error("Error al guardar la pregunta");

        const nuevaPregunta: Pregunta = {
          id: preguntas.length + 1,
          pregunta: newPregunta,
          respuesta: newRespuesta || undefined,
        };

        setPreguntas([...preguntas, nuevaPregunta]);
        setShowModalWithAnswer(false);
        setNewPregunta("");
        setNewRespuesta("");
      } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al guardar la pregunta.");
      }
      setLoadingAddWithAnswer(false);
    }
  };

  const handleSaveWithoutAnswer = async () => {
    if (newPregunta.trim()) {
      setLoadingAddWithoutAnswer(true);
      try {
        const response = await API.post("/api/faq", {
          pregunta: newPregunta,
          respuesta: "", // 👈 Se manda vacío
        });

        if (response.status !== 200) throw new Error("Error al guardar la pregunta");

        const nuevaPregunta: Pregunta = {
          id: preguntas.length + 1,
          pregunta: newPregunta,
        };

        setPreguntas([...preguntas, nuevaPregunta]);
        setShowModalWithoutAnswer(false);
        setNewPregunta("");
      } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al guardar la pregunta.");
      }
      setLoadingAddWithoutAnswer(false);
    }
  };

  const handleListUnanswered = async () => {
    setLoading(true);
    try {
      const response = await API.get("/api/faq/sin_respuesta"); // 👈 usamos GET
      if (response.status !== 200) throw new Error("Error al listar preguntas sin respuesta");

      const data = response.data;

      const resultados: Pregunta[] = data.preguntas_sin_respuesta.map(
        (item: any, index: number) => ({
          id: index + 1, // puedes usar el id de Chroma si lo devuelve
          pregunta: item.pregunta,
          respuesta: item.respuesta,
        })
      );

      setPreguntas(resultados);
    } catch (error) {
      console.error("Error obteniendo preguntas sin respuesta:", error);
      alert("Hubo un error al obtener las preguntas sin respuesta.");
    }
    setLoading(false);
  };


  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Panel lateral */}
      <div className="w-full lg:w-64 bg-white shadow p-4 space-y-4">
        <Button
          onClick={() => setShowModalWithAnswer(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2"
        >
          Agregar pregunta con respuesta
        </Button>
        <Button
          onClick={() => setShowModalWithoutAnswer(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2"
        >
          Agregar pregunta sin respuesta
        </Button>
        <Button
          onClick={handleListUnanswered}   // 👈 ahora llama al backend
          className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2"
        >
          Listar preguntas sin respuesta
        </Button>
        <Button
          onClick={
            () => window.location.href = "/nucleo_conocimiento"
          }
          className="w-full bg-gray-700 hover:bg-gray-800 text-white rounded-lg py-2"
        >
          Inicio
        </Button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Preguntas Frecuentes</h1>

        {/* Buscador */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
          <Input
            type="text"
            id="id"
            label=""
            name="name"
            placeholder="Buscar pregunta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <Button
            onClick={handleSearch}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 ${loadingSearch ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loadingSearch}
          >
            {loadingSearch && <Loader2 className="animate-spin w-5 h-5" />}
            Buscar
          </Button>
        </div>

        {/* Lista de preguntas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[120px] flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full animate-fade-in col-span-2">
              <Loader2 className="animate-spin text-blue-500 w-10 h-10 mb-2" />
              <span className="text-blue-700 font-medium">Cargando preguntas...</span>
            </div>
          ) : preguntas.length > 0 ? (
            preguntas.map((p) => (
              <div key={p.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{p.pregunta}</h2>
                {p.respuesta ? (
                  <p className="text-gray-700">{p.respuesta}</p>
                ) : (
                  <p className="text-red-500 italic">Esta pregunta aún no tiene respuesta.</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No se encontraron preguntas.</p>
          )}
        </div>
        <style>{`
          .animate-fade-in { animation: fadeIn 0.7s ease; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        `}</style>
      </div>

      {/* Modal con respuesta */}
      {showModalWithAnswer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Nueva Pregunta con Respuesta</h2>
            <Input
              id=""
              name=""
              label=""
              type="text"
              placeholder="Escribe la pregunta"
              value={newPregunta}
              onChange={(e) => setNewPregunta(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <textarea
              placeholder="Escribe la respuesta"
              value={newRespuesta}
              onChange={(e) => setNewRespuesta(e.target.value)}
              rows={4}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg resize-none"
            />
            <div className="flex justify-end gap-3">
              <Button onClick={() => setShowModalWithAnswer(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg" disabled={loadingAddWithAnswer}>
                Cancelar
              </Button>
              <Button onClick={handleSaveWithAnswer} className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 ${loadingAddWithAnswer ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={loadingAddWithAnswer}>
                {loadingAddWithAnswer && <Loader2 className="animate-spin w-5 h-5" />}
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal sin respuesta */}
      {showModalWithoutAnswer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Nueva Pregunta sin Respuesta</h2>
            <Input
              id=""
              name=""
              label=""
              type="text"
              placeholder="Escribe la pregunta"
              value={newPregunta}
              onChange={(e) => setNewPregunta(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="flex justify-end gap-3">
              <Button onClick={() => setShowModalWithoutAnswer(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg" disabled={loadingAddWithoutAnswer}>
                Cancelar
              </Button>
              <Button onClick={handleSaveWithoutAnswer} className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 ${loadingAddWithoutAnswer ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={loadingAddWithoutAnswer}>
                {loadingAddWithoutAnswer && <Loader2 className="animate-spin w-5 h-5" />}
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreguntasFrecuentes;
