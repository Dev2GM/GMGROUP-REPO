const Prospeccion = require('../models/prospeccion.model');

exports.createProspeccion = async (req, res) => {
  try {
    const { id_persona, estado, id_usuario } = req.body;
    const id_creador = req.user.id; // Asume que el middleware de auth pone el id del usuario logueado en req.user
    const id = await Prospeccion.create({ id_persona, estado, id_creador, id_usuario });
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar código duplicado y dejar solo la función correcta
exports.getProspecciones = async (req, res) => {
  try {
    const userId = req.user.id; // Asume que el middleware de auth pone el id del usuario logueado en req.user
    const rows = await Prospeccion.findByUser(userId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProspeccionById = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await Prospeccion.findById(id);
    if (!row) return res.status(404).json({ error: 'No encontrado' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProspeccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    console.log(id, estado);
    await Prospeccion.update(id, { estado });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProspeccion = async (req, res) => {
  try {
    const { id } = req.params;
    await Prospeccion.delete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
