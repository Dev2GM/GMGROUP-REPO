const Moneda = require("../models/moneda.model");

exports.getAll = (req, res) => {
  Moneda.getAll((err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Error al obtener monedas" });
    res.json({ success: true, data: rows });
  });
};

exports.getById = (req, res) => {
  Moneda.getById(req.params.id, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Error al obtener moneda" });
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Moneda no encontrada" });
    res.json({ success: true, data: rows[0] });
  });
};

exports.create = (req, res) => {
  Moneda.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error al crear moneda" });
    res.json({ success: true, message: "Moneda creada correctamente", id: result.insertId });
  });
};

exports.update = (req, res) => {
  Moneda.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ success: false, message: "Error al actualizar moneda" });
    res.json({ success: true, message: "Moneda actualizada correctamente" });
  });
};

exports.delete = (req, res) => {
  Moneda.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ success: false, message: "Error al eliminar moneda" });
    res.json({ success: true, message: "Moneda eliminada correctamente" });
  });
};
