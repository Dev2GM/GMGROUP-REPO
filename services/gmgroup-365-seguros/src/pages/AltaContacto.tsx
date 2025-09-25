import { useState, useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { FormSection } from "@/components/formulario/secciones_formulario";
import Select from "@/components/ui/select";
import ContenedorFormulario from "@/components/contenedor_formulario";
import API from "@/api/api";

import type { Corredor } from "@/types/Corredores";

import Swal from "sweetalert2";

export async function loader() {
  const data = {
    corredores: [], 
    location: []
  }

  const responseCorredores = await API.get("/api/corredores");
  if (responseCorredores.status === 200) {
    data.corredores = responseCorredores.data.map((c:Corredor) => {
      return {value: c.id, label: c.nombre}
    });
  } 
  const responseCLocation = await API.get("/api/location");
  if (responseCLocation.status === 200) {
    data.location = responseCLocation.data
  }
  return data
}

export default function AltaContacto() {

  const navigate = useNavigate();
  const data:any = useLoaderData()

  const [formData, setFormData] = useState({
    corredorSeguros: "",
    tipoPersona: "Física", // ✅ Camciado para coincidir con backend
    documento: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    telefono: "",
    pais: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    email: "",
  });

  const [corredoresOptions, setCorredores] = useState(data.corredores);
  const [paisesOptions, setPaises] = useState([]);
  const [departamentosOptions, setDepartamentos] = useState([]);
  const [ciudadesOptions, setCiudades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Opciones actualizadas para coincidir con backend
  const tipoPersonaOptions = [
    { value: "Física", label: "Persona Física" },
    { value: "Jurídica", label: "Persona Jurídica" },
  ];

  // ✅ Cargar paises
  useEffect(() => {
    setPaises(
        data.location.map((p: { id: number; nombre: string }) => ({
            value: p.id,
            label: p.nombre
        }))
    );
  }, [data.location]);

  // ✅ Cargar departamentos cuando cambia paises
  useEffect(() => {
    const pais = data.location.find((p: any) => p.id === Number(formData.pais));
    const departamentos = pais?.departamentos ?? [];

    setDepartamentos(
        departamentos.map((p: { id: number; nombre: string }) => ({
            value: p.id,
            label: p.nombre
        }))
    );
  }, [formData.pais]);

  // ✅ Cargar ciudades cuando cambia departamento
  useEffect(() => {
    const pais = data.location.find((p: any) => p.id === Number(formData.pais));
    const departamentos = pais?.departamentos.find((d: any) => d.id === Number(formData.departamento)) ?? [];
    const ciudades = departamentos.ciudades ?? [];

    setCiudades(
        ciudades.map((p: { id: number; nombre: string }) => ({
            value: p.id,
            label: p.nombre
        }))
    );
  }, [formData.departamento]);

  // Función de búsqueda
  const handleSubmit = async () => {
    const { corredorSeguros, tipoPersona, documento } = formData;

    if (!corredorSeguros || !tipoPersona || !documento) {
      Swal.fire(
        "Campos incompletos",
        "Completa todos los campos para buscar.",
        "warning"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await API.get(`/api/personas/filtrar?cedula=${documento}&id_corredor=${corredorSeguros}&tipo=${tipoPersona}`, {
        headers: {
          "Authorization" : `Bearer ${localStorage.getItem("token")}`
        }
      });


      if (response.status === 404) {
        Swal.fire(
          "No encontrado",
          "No se encontró una persona con esos datos.",
          "info"
        );
        setIsLoading(false);
        return;
      }

      // Autocompletar formulario
      const p = response.data;
      setFormData((prev) => ({
        ...prev,
        nombre: p.nombres || "",
        apellido: p.apellidos || "",
        fechaNacimiento: p.fecha_nacimiento?.split("T")[0] || "",
        telefono: p.telefono || "",
        pais: p.id_pais?.toString() || "",
        departamento: p.id_departamento?.toString() || "",
        ciudad: p.id_ciudad?.toString() || "",
        direccion: p.direccion || "",
        email: p.email || "",
      }));

    } catch (error) {
      console.error("Error al buscar persona:", error);
      Swal.fire("Error", "Ocurrió un error al buscar la persona.", "error");
    } finally {
      setIsLoading(false);
    }

  };

  // guardar contacto
  const handleSaveContact = async () => {
    const { corredorSeguros, nombre, documento } = formData;

    if (!corredorSeguros || !nombre || !documento) {
      Swal.fire("Error", "Faltan campos obligatorios.", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const response = await API.post("/api/personas/upsert", JSON.stringify(formData));

      if (response.status === 200) {
        Swal.fire("¡Éxito!", response.data.message, "success");
        setFormData({
          corredorSeguros: "",
          tipoPersona: "Física",
          documento: "",
          nombre: "",
          apellido: "",
          fechaNacimiento: "",
          telefono: "",
          pais: "",
          departamento: "",
          ciudad: "",
          direccion: "",
          email: "",
        });
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Error al guardar contacto.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al guardar contacto:", error);
      Swal.fire("Error", "Ocurrió un error al guardar el contacto.", "error");
    } finally {
      setIsLoading(false);
    }

  };

  // guardar y continuar
  const handleSaveAndContinue = async () => {
    await handleSaveContact();
    navigate("/alta-poliza");
  };

  return (
    <ContenedorFormulario title="Alta de contacto">
      {/* Sección de búsqueda */}
      <FormSection columns={4}>
        <Select
          id="corredorSeguros"
          name="corredorSeguros"
          label="Corredor de seguros"
          options={corredoresOptions}
          value={formData.corredorSeguros}
          onChange={(e) =>
            setFormData({ ...formData, corredorSeguros: e.target.value })
          }
          required
        />

        <Select
          id="tipoPersona"
          name="tipoPersona"
          label="Tipo de persona"
          options={tipoPersonaOptions}
          value={formData.tipoPersona}
          onChange={(e) =>
            setFormData({ ...formData, tipoPersona: e.target.value })
          }
          required
        />

        <Input
          id="documento"
          name="documento"
          label="Documento"
          value={formData.documento}
          onChange={(e) =>
            setFormData({ ...formData, documento: e.target.value })
          }
          required
        />

        <div className="flex items-center justify-center h-full">
          <Button
            variant="secondary"
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Buscando..." : "Buscar"}
          </Button>
        </div>
      </FormSection>

      {/* Datos del contacto */}
      <FormSection title="Datos del contacto" columns={2}>
        <Input
          id="nombre"
          name="nombre"
          label="Nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />

        <Input
          id="apellido"
          name="apellido"
          label="Apellido"
          value={formData.apellido}
          onChange={(e) =>
            setFormData({ ...formData, apellido: e.target.value })
          }
        />
      </FormSection>

      <FormSection columns={2}>
        <Input
          id="fechaNacimiento"
          name="fechaNacimiento"
          label="Fecha de nacimiento"
          type="date"
          value={formData.fechaNacimiento}
          onChange={(e) =>
            setFormData({ ...formData, fechaNacimiento: e.target.value })
          }
        />

        <Input
          id="telefono"
          name="telefono"
          label="Teléfono"
          type="tel"
          value={formData.telefono}
          onChange={(e) =>
            setFormData({ ...formData, telefono: e.target.value })
          }
        />
      </FormSection>

      {/* Datos de la dirección */}
      <FormSection title="Datos de la dirección" columns={2}>
        <Select
          id="pais"
          name="pais"
          label="Pais"
          options={paisesOptions}
          value={formData.pais}
          onChange={(e) => {
            setFormData({
              ...formData,
              pais: e.target.value,
              ciudad: "", // Limpiar ciudad al cambiar departamento
            });
          }}
        />

        <Select
          id="departamento"
          name="departamento"
          label="Departamento"
          options={departamentosOptions}
          value={formData.departamento}
          onChange={(e) => {
            setFormData({
              ...formData,
              departamento: e.target.value,
              ciudad: "", // Limpiar ciudad al cambiar departamento
            });
          }}
        />

        <Select
          id="ciudad"
          name="ciudad"
          label="Ciudad"
          options={ciudadesOptions}
          value={formData.ciudad}
          onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
        //   disabled={!formData.departamento}
        />
      </FormSection>

      <FormSection columns={2}>
        <Input
          id="direccion"
          name="direccion"
          label="Domicilio"
          value={formData.direccion}
          onChange={(e) =>
            setFormData({ ...formData, direccion: e.target.value })
          }
        />

        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </FormSection>

      {/* Botones de acción */}
      <FormSection columns={2}>
        <Button type="button" onClick={handleSaveContact} disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar contacto"}
        </Button>
        <Button
          type="button"
          onClick={handleSaveAndContinue}
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Guardar y continuar con póliza"}
        </Button>
      </FormSection>
    </ContenedorFormulario>
  );
}