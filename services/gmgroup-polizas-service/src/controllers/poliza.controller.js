const Poliza = require("../models/poliza.model");
const Joi = require("joi");

// Validación básica

const schema = Joi.object({
  codigo: Joi.string().required(),
  fecha_inicio: Joi.date().required(),
  fecha_fin: Joi.date().required(),
  precio: Joi.number().required(),
  n_cuotas: Joi.number().min(1).required(),
  prima: Joi.number().allow(null),
  referencia: Joi.string().allow("", null),
  id_cobertura: Joi.number().required(),
  id_moneda: Joi.number().required(),
  id_metodo: Joi.number().required(),
  id_auto: Joi.number().allow(null),
  id_persona: Joi.number().required(),
  id_canal: Joi.number().required(),
  id_corredor: Joi.number().required(),
});

// ⚡ Función para transformar strings en los tipos correctos
const normalizePayload = (formData) => ({
  codigo: formData.codigo,
  fecha_inicio: new Date(formData.fecha_inicio), // string → Date
  fecha_fin: new Date(formData.fecha_fin),       // string → Date
  precio: parseFloat(formData.precio),       // string → float
  n_cuotas: parseInt(formData.n_cuotas, 10),   // string → int
  prima: formData.prima 
    ? parseFloat(formData.prima) 
    : null,                                                  // string → float | null
  referencia: formData.referencia || null,      // vacío → null
  id_cobertura: parseInt(formData.id_cobertura, 10),
  id_moneda: parseInt(formData.id_moneda, 10),
  id_metodo: parseInt(formData.id_metodo, 10),
  id_auto: formData?.id_auto 
    ? parseInt(formData.id_auto, 10) 
    : null,                                                  // opcional
  id_persona: parseInt(formData.id_persona, 10),
  id_canal: parseInt(formData.id_canal, 10),
  id_corredor: parseInt(formData.id_corredor, 10),
});

// 🚀 En tu controller:
exports.create = (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    
    const { error, value } = schema.validate(payload);
    if (error) return res.status(400).json({ error: error.message });
    
    // Aquí ya puedes pasar "value" al modelo
    
    Poliza.create(value, (err, result) => {
      console.log(err)
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: "Poliza creada", id: result.id });
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};