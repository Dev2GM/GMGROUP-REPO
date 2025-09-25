import { useState } from "react";
import { useNavigate, useLoaderData, type NavigateFunction } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import Tabla from "@/components/tabla";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/select";
import { handleChange } from "@/lib/utils";
import API from "@/api/api";

import type { Corredor } from "@/types/Corredores";

import Swal from "sweetalert2";

export async function loader() {
    try {
      const response = await API.get("/api/corredores");
      if (response.status === 200) {
        const data = response.data.map((c:Corredor) => {
          return {value: c.id, label: c.nombre}
        });
        return data;
      } 
      return [];
    } catch (error) {
      return [];
    }
}

export default function Buscador_general() {
  const navigate = useNavigate();
  const corredores:any = useLoaderData();

  const [formData, setFormData] = useState({
    corredorSeguros: 1,
    informacionReferente: "",
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setShowResults(false);

    const { corredorSeguros, informacionReferente } = formData;

    if (!corredorSeguros || !informacionReferente.trim()) {
      setSearchResults([]);
      setShowResults(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await API.get("/api/personas/buscar", {
        params: { id_corredor: corredorSeguros, q: informacionReferente },
      });
      // ✅ CAMBIO: El endpoint buscador-general mantiene su estructura original
      if (response.status === 200) {
        setSearchResults(response.data || []); // 👈 Este se mantiene igual
      } else {
        setSearchResults([]);
        Swal.fire("Error", "No se encontraron resultados", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se encontraron resultados", "error");
      setSearchResults([]);
    }

    setShowResults(true);
    setIsLoading(false);
  };

  return (
    <section className="max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Buscador General</h1>
        <p className="leading-relaxed max-w-2xl mx-auto">
          En este apartado puedes{" "}
          <span className="font-semibold text-principal">
            buscar contactos o pólizas
          </span>
          , simplemente escribe alguna información referente. Ej. Número de
          poliza, referencia, documento,etc...
        </p>
      </header>

      <form onSubmit={handleSubmit} className="p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div>
            <div className="relative">
              <Select
                id="corredorSeguros"
                name="corredorSeguros"
                label="Corredor de seguros"
                value={formData.corredorSeguros.toString()}
                onChange={(e) => handleChange(e, setFormData)}
                options={corredores}
              />
            </div>
          </div>

          <div>
            <Input
              id="informacionReferente"
              name="informacionReferente"
              label="Información referente"
              value={formData.informacionReferente}
              onChange={(e) => handleChange(e, setFormData)}
              placeholder="Ej: Perez, 11111, Carlos..."
            />
            {/* <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <Search className="h-4 w-4" />
            </div> */}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button
            type="submit"
            variant="default"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Buscando...</span>
              </div>
            ) : (
              "Buscar contacto o póliza"
            )}
          </Button>
        </div>
      </form>

      {/* Resultados de la búsqueda */}
      {showResults && (
        <>
          {searchResults && searchResults.length > 0 ? (
            <Tabla results={searchResults} />
          ) : (
            <NoResultsMessage navigate={navigate}/>
          )}
        </>
      )}

      <div className="text-center mt-12">
        <Button
          type="button"
          variant="default"
          size="lg"
          className="flex items-center mx-auto"
        >
          Novedades
        </Button>
      </div>
    </section>
  );
}

interface NoResultsMessageProps {
  navigate:NavigateFunction
}
function NoResultsMessage({navigate} : NoResultsMessageProps) {
  return <div className="bg-red-50 rounded-xl p-6 mb-8 text-center">
      <p className="text-rojo font-medium mb-4">
        No hay información sobre esta persona, prueba a{" "}
        <button
          onClick={() => navigate("/alta_contacto")}
          className="text-rojo underline hover:text-rojo font-semibold bg-transparent border-none cursor-pointer"
        >
          DARLA DE ALTA (clic aquí)
        </button>
      </p>
    </div>
}