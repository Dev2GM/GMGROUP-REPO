import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/Button";
import API from "@/api/api";
import { handleChange } from "@/lib/utils";
import Select from "@/components/ui/select";

const NucleoConocimiento = () => {
  const [grupos, setGrupos] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [formData, setFormData] = useState({
    grupo: 0,
    texto: "",
  });
  const [posts, setPosts] = useState([]); // 👈 ahora se llena desde el backend

  // 🔹 Cargar grupos disponibles
  useEffect(() => {
    const cargarGrupos = async () => {
      try {
        const response = await API.get("/api/groups");
        setGrupos(
          response.data.groups.map((g: any) => {
            return { value: g.id, label: g.nombre };
          })
        );
      } catch (error) {
        console.error("Error al cargar grupos:", error);
      }
    };
    cargarGrupos();
  }, []);

  // 🔹 Cargar novedades al montar
  useEffect(() => {
    const cargarNovedades = async () => {
      setLoadingData(true);
      try {
        const response = await API.get("/api/novedades");
        setPosts(response.data); // ✅ el backend ya devuelve enriquecido
      } catch (error) {
        console.error("Error al cargar novedades:", error);
      }
      setLoadingData(false);
    };
    cargarNovedades();
  }, []);

  const handlePublish = async () => {
    if (formData.texto.trim() && formData.grupo > 0) {
      setLoadingPublish(true);
      try {
        await API.post("/api/novedades", {
          id_grupo: formData.grupo,
          novedad: formData.texto,
        });
        // Recargar lista de posts en lugar de refrescar página
        const response = await API.get("/api/novedades");
        setPosts(response.data);
        setFormData({ grupo: 0, texto: "" });
      } catch (error) {
        console.error("Error al publicar novedad:", error);
      }
      setLoadingPublish(false);
    }
  };

  const quickAccessItems = [
    { title: "Preguntas frecuentes", bgColor: "bg-verde", hoverColor: "hover:bg-green-600", src: "preguntas"},
    { title: "Manuales y materiales", bgColor: "bg-naranja", hoverColor: "hover:bg-orange-600", src: "manuales_materiales" },
    { title: "Conocimiento bot IA", bgColor: "bg-principal", hoverColor: "hover:bg-blue-600", src: "conocimiento_bot" },
  ];

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-white">
        <div className="text-center py-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Núcleo de conocimiento</h1>
        </div>

        <div className="flex p-8 space-x-8">
          <div className="flex-1 space-y-6">
            {/* Formulario */}
            <div className="bg-white rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grupo</label>
                  <Select
                    id="grupo"
                    name="grupo"
                    label="Selecciona o escribe un grupo"
                    value={formData.grupo.toString()}
                    onChange={(e) => handleChange(e, setFormData)}
                    options={grupos}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">¿Qué quieres compartir?</label>
                  <textarea
                    id="texto"
                    name="texto"
                    value={formData.texto}
                    onChange={(e) => handleChange(e, setFormData)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gris rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Comparte tu conocimiento, experiencia o pregunta..."
                  />
                </div>

                <div className="flex justify-start">
                  <Button
                    onClick={handlePublish}
                    className={`bg-principal hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${loadingPublish ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={loadingPublish}
                  >
                    {loadingPublish && <Loader2 className="animate-spin w-5 h-5" />}
                    Publicar
                  </Button>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-4 min-h-[120px] flex flex-col justify-center items-center w-full" style={{overflowY: 'auto', maxHeight: 'calc(100vh - 320px)'}}>
              {loadingData ? (
                <div className="flex flex-col items-center justify-center w-full animate-fade-in">
                  <Loader2 className="animate-spin text-blue-500 w-10 h-10 mb-2" />
                  <span className="text-blue-700 font-medium">Cargando novedades...</span>
                </div>
              ) : (
                posts.length > 0 ? (
                  posts.map((post: any) => (
                    <div key={post.id} className="bg-white rounded-lg border border-gris p-6 w-full">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="font-semibold text-gray-800">
                          {post.usuario?.username || "Usuario"}
                        </span>
                        <span className="text-gray-500">en grupo</span>
                        <span className="font-medium text-blue-600">
                          {post.grupo?.nombre || "Sin grupo"}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{post.novedad}</p>
                      <div className="mt-4 text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No hay novedades aún.</p>
                )
              )}
            </div>
            <style>{`
              .animate-fade-in { animation: fadeIn 0.7s ease; }
              @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
            `}</style>
          </div>

          {/* Panel de accesos rápidos */}
          <div className="w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Accesos rápidos</h2>
            <div className="space-y-3">
              {quickAccessItems.map((item, index) => (
                <a
                  href={item.src}
                  key={index}
                  className={`w-full ${item.bgColor} ${item.hoverColor} text-white p-4 rounded-lg font-medium text-left transition-colors flex items-center space-x-3`}
                >
                  {item.title === "Conocimiento bot IA" && <Bot className="w-5 h-5" />}
                  <span>{item.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NucleoConocimiento;
