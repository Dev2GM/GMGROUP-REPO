const Ramo = require('../models/ramo.model');
const Joi = require('joi');

// Validación con Joi (para crear/actualizar ramos)
const schema = Joi.object({
  nombre: Joi.string().required(),
  descripcion: Joi.string().allow('', null),
  id_corredor: Joi.number().integer().required(),
});

// Obtener ramos de un corredor
exports.getByCorredorId = (req, res) => {
  const { id_corredor } = req.params;
  Ramo.getByCorredorId(id_corredor, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Crear ramo
exports.create = (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  Ramo.create(value, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Ramo creado', id: result.insertId });
  });
};

// Actualizar ramo
exports.update = (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  Ramo.update(req.params.id, value, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Ramo actualizado' });
  });
};

// Eliminar ramo
exports.delete = (req, res) => {
  Ramo.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Ramo eliminado' });
  });
};
