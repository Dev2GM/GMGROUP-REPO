const Persona = require('../models/persona.model');
const Joi = require('joi');
require('dotenv').config();
const db = require('../config/db');

const schema = Joi.object({
  tipo: Joi.string().valid('Fisica','Juridica').required(),
  nombres: Joi.string().required(),
  apellidos: Joi.string().allow(null,''),
  genero: Joi.string().valid('Masculino','Femenino','Otro').allow(null),
  documento: Joi.string().required(),
  telefono: Joi.string().allow(null,''),
  direccion: Joi.string().allow(null,''),
  email: Joi.string().email().required(),
  fecha_nacimiento: Joi.date().allow(null),
  foto: Joi.string().allow(null,''),
  id_corredor: Joi.number().allow(null),
  id_ciudad: Joi.number().allow(null),
  id_usuario: Joi.number().allow(null),
  es_cliente: Joi.boolean().allow(null)
});

exports.getAll = (req,res)=>{
  Persona.getAll((err,result)=>{
    if(err) return res.status(500).json({error: err.message});
    res.json(result);
  });
};

exports.getById = (req,res)=>{
  Persona.getById(req.params.id,(err,result)=>{
    if(err || result.length===0) 
      return res.status(404).json({message:'Persona no encontrada'});
    res.json(result[0]);
  });
};

exports.create = (req,res)=>{
  const {error,value} = schema.validate(req.body);
  if(error) return res.status(400).json({error:error.message});
  console.log(value)
  // Persona.create(value,(err,result)=>{
  //   if(err) {
  //     if (err.code === 'ER_DUP_ENTRY') {
  //       return res.status(409).json({ error: 'Documento o Email ya registrado' });
  //     }
  //     return res.status(500).json({error: err.message});
  //   }
  //   res.status(200).json({message:'Persona creada', persona: result});
  // });
};

exports.update = (req,res)=>{
  const {error,value} = schema.validate(req.body);
  if(error) return res.status(400).json({error:error.message});

  Persona.update(req.params.id,value,(err)=>{
    if(err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Documento o Email ya registrado' });
      }
      return res.status(500).json({error: err.message});
    }
    res.json({message:'Persona actualizada'});
  });
};

exports.delete = (req,res)=>{
  Persona.delete(req.params.id,(err)=>{
    if(err) return res.status(500).json({error: err.message});
    res.json({message:'Persona eliminada'});
  });
};

// controllers/persona.controller.js
exports.getBatch = async (req, res) => {
  try {
    const { ids } = req.body; // Array de id_persona
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Debe enviar un array de ids" });
    }

    Persona.getAllBatch(ids, (err, result) => {
      if(err) return res.status(500).json({error: err.message});
      console.log(result)
      res.json({data: result})
    })

  } catch (err) {
    console.error("Error en getBatch personas:", err.message);
    res.status(500).json({ error: err.message });
  }
};


exports.search = async (req, res) => {
  const { id_corredor, q } = req.query;

  if (!id_corredor || !q) {
    return res.status(400).json({ error: "Debe enviar id_corredor y q (string de búsqueda)" });
  }

  try {
    const result = await Persona.searchByCorredor(id_corredor, q);

    if (result.length === 0) {
      return res.status(404).json({ message: "No se encontraron personas" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error en búsqueda:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.filter = (req, res) => {
  const { cedula, id_corredor, tipo } = req.query;

  if (!cedula || !id_corredor) {
    return res.status(400).json({
      error: "Debe enviar cedula y id_corredor"
    });
  }

  Persona.filter(cedula, id_corredor, tipo, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      return res.status(404).json({ message: "Persona no encontrada" });
    }
    res.json(result[0]); // retorna la persona encontrada
  });
};

exports.upsert = async (req, res) => {
  try {
    const {
      corredorSeguros,
      tipoPersona,
      documento,
      nombre,
      apellido,
      fechaNacimiento,
      telefono,
      direccion,
      email,
      ciudad,
    } = req.body;

    // Mapear a los nombres que maneja la BD
    const cedula = documento;
    const tipo_persona = tipoPersona;
    const id_corredor = parseInt(corredorSeguros);
    const id_ciudad = ciudad ? parseInt(ciudad) : null;
    const fecha_nacimiento = fechaNacimiento || null;

    // Buscar si ya existe (cedula + id_corredor)
    const [rows] = await db.query(
      `SELECT * FROM Personas WHERE documento = ? AND id_corredor = ?`,
      [cedula, id_corredor]
    );

    const exists = rows[0]; 

    const data = {
      tipo: tipo_persona,
      nombres: nombre,
      apellidos: apellido,
      genero: null, // si más adelante lo incluyes
      documento: cedula,
      telefono,
      direccion,
      email,
      fecha_nacimiento,
      foto: null,
      id_corredor,
      id_ciudad,
      es_cliente: true,
    };


    let result;
    if (exists) {
      result = await Persona.update(exists.id, data);
      return res.json({
        success: true,
        message: "Persona actualizada correctamente",
        id: exists.id,
      });
    } else {
      // crear
      result = await Persona.create(data);
      return res.json({
        success: true,
        message: "Persona creada correctamente",
        id: result.insertId,
      });
    }
  } catch (error) {
    console.error("Error en upsertPersona:", error);
    res.status(500).json({
      success: false,
      message: "Error al guardar persona",
      error: error.message,
    });
  }
};

exports.getByUsuarioId = async (req, res) => {
  const { id_usuario } = req.params;
  console.log(id_usuario)

  try {
    const persona = await Persona.getByUsuarioId(id_usuario);
    if (!persona) {
      return res.status(200).json(null); // si no existe, devolvemos null
    }

    res.json(persona);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.linkOrCreate = async (req, res) => {
  try {
    const { id_usuario, persona } = req.body;
    if (!id_usuario) return res.status(400).json({ error: 'id_usuario requerido' });
    if (!persona || (!persona.documento && !persona.email)) {
      return res.status(400).json({ error: 'Se requiere persona con documento o email' });
    }

    const result = await Persona.linkOrCreateAndLinkUser(persona, id_usuario);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error linkOrCreate persona:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Documento o email duplicado' });
    }
    res.status(500).json({ error: err.message });
  }
};
exports.getPersonasByUsuarios = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Debe enviar un array de ids de usuarios" });
    }

    const personas = await Persona.getByUsuarios(ids);

    res.json({ data: personas });
  } catch (err) {
    console.error("Error en getPersonasByUsuarios:", err.message);
    res.status(500).json({ error: err.message });
  }
};
