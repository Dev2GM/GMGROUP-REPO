import Evento from "../models/evento.models.js";
import axios from "axios";

export const getEventos = async (req, res) => {
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

    const eventos = await Evento.getAll();
    if (eventos.length === 0) return res.json([]);

    const idsUsuarios = eventos.map((e) => e.id_usuario);
    const personasRes = await axios.post(
      `${process.env.API_URL}/api/personas/by-usuarios`,
      { ids: idsUsuarios }, {
        headers: {
          "x-service-token" : process.env.SERVICE_INTERNAL_TOKEN
        }
      }
    );

    const personasMap = new Map(
      personasRes.data.data.map((p) => [p.id_usuario, p])
    );

    const eventosFiltrados = [];
    for (const e of eventos) {
      const personaEvento = personasMap.get(e.id_usuario);
      if (!personaEvento) continue;
      if (personaEvento.id_ciudad == id_ciudad_usuario) {
        eventosFiltrados.push({
          ...e,
          persona: personaEvento,
        });
      }
    }

    res.json(eventosFiltrados);
  } catch (err) {
    console.error("Error en getEventos:", err.message);
    res.status(500).json({ error: err.message });
  }
};


export const createEvento = async (req, res) => {
  try {
    const imagenUrl = req.file
      ? `${process.env.API_URL}/eventos/uploads/eventos/${req.file.filename}`
      : null;

    const nuevo = await Evento.create(
      { ...req.body, imagen: imagenUrl },
      req.user.id
    );

    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};