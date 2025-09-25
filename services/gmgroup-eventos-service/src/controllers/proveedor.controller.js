import Proveedor from "../models/proveedor.model.js";
import axios from "axios"

export const getProveedores = async (req, res) => {
  try {
    let id_ciudad_usuario = null;

    if (req.user) {
      const token = req.headers["authorization"]?.split(" ")[1];
      const personaRes = await axios.get(
        `${process.env.API_URL}/api/personas/by-usuario/${req.user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (personaRes.data) {
        id_ciudad_usuario = personaRes.data.id_ciudad;
      }
    } else {
      id_ciudad_usuario = req.ciudad
    }

    const proveedores = await Proveedor.getAll();
    if (proveedores.length === 0) return res.json([]);

    const idsPersonas = proveedores.map((p) => p.id_persona);
    const personasRes = await axios.post(
      `${process.env.API_URL}/api/personas/batch`,
      { ids: idsPersonas }, {
        headers: {
          "x-service-token" : process.env.SERVICE_INTERNAL_TOKEN
        }
      }
    );

    const personas = personasRes.data.data || personasRes.data;
    const personasMap = new Map(personas.map((p) => [p.id, p]));
    const proveedoresFiltrados = [];
    for (const p of proveedores) {
      const personaProveedor = personasMap.get(p.id_persona);
      if (!personaProveedor) continue;

      if (personaProveedor.id_ciudad == id_ciudad_usuario) {
        const calificaciones = await Proveedor.getCalificaciones(p.id);
        proveedoresFiltrados.push({
          ...p,
          persona: personaProveedor,
          calificaciones,
        });
      }
    }
    res.json(proveedoresFiltrados);
  } catch (err) {
    console.error("Error en getProveedores:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const createProveedor = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const id_usuario = req.user.id; // viene del middleware authenticate

    // 1️⃣ Consultar persona por usuario en el microservicio
    const personaRes = await axios.get(
      `${process.env.API_URL}/api/personas/by-usuario/${id_usuario}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const persona = personaRes.data;

    if (!persona) {
      return res.status(400).json({ error: "El usuario no tiene persona vinculada" });
    }

    // 2️⃣ Crear proveedor con el id_persona
    const { categoria, descripcion } = req.body;

    const nuevo = await Proveedor.create({
      id_persona: persona.id,
      categoria,
      descripcion,
    });

    res.status(201).json(nuevo);
  } catch (err) {
    console.error("Error creando proveedor:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const calificarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const haCalificado = await Proveedor.haCalificado(id, req.user.id);
    if (haCalificado.length > 0) {
      await Proveedor.updateCalificacion(id, req.body, req.user.id);
    } else {
      await Proveedor.addCalificacion(id, req.body, req.user.id);
    }
    res.status(201).json({ message: "Calificación añadida" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
