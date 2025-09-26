const db = require('../config/db');

const Prospeccion = {
  create: async (data) => {
    const { id_persona, estado, id_creador, id_usuario } = data;
    const [result] = await db.execute(
      `INSERT INTO Prospeccion (id_persona, estado, id_creador, id_usuario) VALUES (?, ?, ?, ?)`,
      [id_persona, estado, id_creador, id_usuario]
    );
    return result.insertId;
  },

  findByUser: async (userId) => {
    // Obtener las prospecciones y la persona
    const [rows] = await db.query(`
      SELECT p.*, per.nombres AS persona_nombres, per.apellidos AS persona_apellidos, per.documento AS persona_documento, per.telefono AS persona_telefono, per.email AS persona_email
      FROM Prospeccion p
      JOIN Personas per ON p.id_persona = per.id
      WHERE p.id_creador = ? OR p.id_usuario = ?
    `, [userId, userId]);

    // Obtener los ids únicos de usuarios (creador y asignado)
    const userIds = Array.from(new Set(rows.flatMap(row => [row.id_usuario, row.id_creador])));

    // Petición HTTP al servicio auth para obtener los datos de los usuarios
    const axios = require('axios');
    const AUTH_URL = process.env.API_URL || 'http://localhost:3001';
    const TOKEN_SECRET = process.env.SERVICE_INTERNAL_TOKEN;
    let usuarios = {};
    try {
      const res = await axios.post(`${AUTH_URL}/api/users/batch`, { ids: userIds }, {
        headers: { 'x-service-token': `${TOKEN_SECRET}` }
      });
      // res.data debe ser un array de usuarios
      res.data.forEach(u => { usuarios[u.id] = u; });
    } catch (err) {
      // Si falla, dejar los datos de usuario vacíos
      userIds.forEach(id => { usuarios[id] = { id, nombres: '', apellidos: '', username: '' }; });
    }

    // Formatear la respuesta para frontend
    return rows.map(row => ({
      id: row.id,
      estado: row.estado,
      persona: {
        id: row.id_persona,
        nombres: row.persona_nombres,
        apellidos: row.persona_apellidos,
        documento: row.persona_documento,
        telefono: row.persona_telefono,
        email: row.persona_email
      },
      usuario: usuarios[row.id_usuario] || { id: row.id_usuario, nombres: '', apellidos: '', username: '' },
      creador: usuarios[row.id_creador] || { id: row.id_creador, nombres: '', apellidos: '', username: '' }
    }));
  },

  findById: async (id) => {
    const [rows] = await db.execute(
      `SELECT * FROM Prospeccion WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  update: async (id, data) => {
    const { estado } = data;
    await db.execute(
      `UPDATE Prospeccion SET estado = ?, fecha_update = CURRENT_TIMESTAMP WHERE id = ?`,
      [estado, id]
    );
    return true;
  },

  delete: async (id) => {
    await db.execute(`DELETE FROM Prospeccion WHERE id = ?`, [id]);
    return true;
  }
};

module.exports = Prospeccion;
