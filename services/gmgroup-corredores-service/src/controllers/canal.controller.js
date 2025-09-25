const Canal = require("../models/canal.model");

exports.getAll = (req, res) => {
  Canal.getAll((err, rows) => {
    if (err) {
      console.error("Error en getAll Canales:", err);
      return res.status(500).json({ success: false, message: "Error al obtener canales" });
    }
    res.json({ success: true, data: rows });
  });
};

exports.getById = (req, res) => {
  const { id } = req.params;
  Canal.getById(id, (err, rows) => {
    if (err) {
      console.error("Error en getById Canal:", err);
      return res.status(500).json({ success: false, message: "Error al obtener canal" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Canal no encontrado" });
    }
    res.json({ success: true, data: rows[0] });
  });
};

exports.create = (req, res) => {
  Canal.create(req.body, (err, result) => {
    if (err) {
      console.error("Error en create Canal:", err);
      return res.status(500).json({ success: false, message: "Error al crear canal" });
    }
    res.json({ success: true, message: "Canal creado correctamente", id: result.insertId });
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  Canal.update(id, req.body, (err) => {
    if (err) {
      console.error("Error en update Canal:", err);
      return res.status(500).json({ success: false, message: "Error al actualizar canal" });
    }
    res.json({ success: true, message: "Canal actualizado correctamente" });
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;
  Canal.delete(id, (err) => {
    if (err) {
      console.error("Error en delete Canal:", err);
      return res.status(500).json({ success: false, message: "Error al eliminar canal" });
    }
    res.json({ success: true, message: "Canal eliminado correctamente" });
  });
};

exports.filterByCorredor = (req, res) => {
  const { id_corredor } = req.query;
  if (!id_corredor) {
    return res.status(400).json({ success: false, message: "Falta el parámetro id_corredor" });
  }

  Canal.filterByCorredor(id_corredor, (err, rows) => {
    if (err) {
      console.error("Error en filterByCorredor:", err);
      return res.status(500).json({ success: false, message: "Error al filtrar canales" });
    }
    res.status(200).json({ success: true, canales: rows });
  });
};
