const Corredor = require('../models/corredor.model');
const Joi = require('joi');

const schema = Joi.object({
  nombre: Joi.string().required(),
  telefono: Joi.string().required(),
  email: Joi.string().email().required(),
  direccion: Joi.string().required(),
  direccion2: Joi.string().allow('', null),
  horario: Joi.string().required(),
});

exports.getAll = (req, res) => {
  Corredor.getAll((err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(result);
  });
};

exports.getById = (req, res) => {
  Corredor.getById(req.params.id, (err, result) => {
    if (err || result.length === 0)
      return res.status(404).json({ message: 'Corredor no encontrado' });
    res.json(result[0]);
  });
};

exports.create = (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  Corredor.create(value, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Corredor creado', id: result.insertId });
  });
};

exports.update = (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  Corredor.update(req.params.id, value, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Corredor actualizado' });
  });
};

exports.delete = (req, res) => {
  Corredor.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Corredor eliminado' });
  });
};
