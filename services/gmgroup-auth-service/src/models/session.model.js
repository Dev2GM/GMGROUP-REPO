const db = require('../config/db');

const createSession = async (session) => {
  const { id_usuario, token_jwt } = session;
  await db.query(`
    INSERT INTO sesiones (id_usuario, token_jwt, activo)
    VALUES (?, ?, ?)
  `, [id_usuario, token_jwt, true]);
};

const closeSessions = async (id_usuario) => {
  await db.query("UPDATE sesiones SET activo = ? WHERE id_usuario = ?",
    [false, id_usuario]
  )
}

const closeSession = async (token) => {
  await db.query("UPDATE sesiones SET activo = ? WHERE token_jwt = ?",
    [false, token]
  )
}

const getSession = async (token) => {
  const [rows] = await db.query("SELECT * FROM sesiones JOIN usuarios ON usuarios.id = sesiones.id_usuario WHERE token_jwt = ? AND activo = ? AND usuarios.estado = ?",
    [token, 1, 'activo']
  )
  return rows[0]
}

module.exports = { createSession, closeSessions, closeSession, getSession }