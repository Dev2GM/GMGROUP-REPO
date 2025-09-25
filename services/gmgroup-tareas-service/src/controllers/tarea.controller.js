const Tarea = require("../models/tarea.model");

// Crear tarea
const createTarea = async (req, res) => {
  try {
    const tareaData = req.body;

    if (!tareaData.titulo || !tareaData.fecha || !tareaData.hora_inicio) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // asignamos creador según el token validado en middleware
    tareaData.id_creador = req.user.id;
    const newTarea = await Tarea.createTarea(tareaData);
    res.status(201).json(newTarea);
  } catch (err) {
    console.error("Error creando tarea:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener todas las tareas
const getTareas = async (req, res) => {
  try {
    const tareas = await Tarea.getAllTareas();
    res.status(200).json(tareas);
  } catch (err) {
    console.error("Error obteniendo tareas:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const updateTarea = async (req, res) => {
  try {
    const tareaData = req.body;
    const { id } = req.params; // el id de la tarea lo mandas por la URL

    console.log(tareaData)

    if (!id) {
      return res.status(400).json({ message: "Falta el id de la tarea" });
    }

    if (!tareaData.titulo || !tareaData.fecha || !tareaData.hora_inicio) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // opcional: reforzar que el creador es el del token
    tareaData.id_creador = req.user.id;
    tareaData.id = id;

    const updatedTarea = await Tarea.updateTarea(tareaData);

    if (updatedTarea.affectedRows === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.status(200).json(updatedTarea);
  } catch (err) {
    console.error("Error actualizando tarea:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


module.exports = { createTarea, getTareas, updateTarea };
