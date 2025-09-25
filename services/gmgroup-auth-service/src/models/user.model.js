const db = require('../config/db');

const findUserByUsername = async (username) => {
  const [rows] = await db.query('SELECT * FROM Usuarios WHERE username = ?', [username]);
  return rows[0];
};

const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM Usuarios WHERE email = ?', [email]);
  return rows[0];
};

const createUser = async (user) => {
  const { username, password_hash, nombres, apellidos, email, fecha_nacimiento, telefono, id_empresa } = user;
  
  const [result] = await db.query(`
    INSERT INTO Usuarios (username, password_hash, nombres, apellidos, email, fecha_nacimiento, telefono, id_empresa)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [username, password_hash, nombres, apellidos, email, fecha_nacimiento, telefono, id_empresa]);
  
  return { id: result.insertId, ...user }; // ✅ devolvemos el id generado + data
};

const deleteUserById = async (id) => {
  const [result] = await db.query(
    "DELETE FROM Usuarios WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0; // true si borró algo
};


const logUser = async (id) => {
  await db.query(`
    UPDATE usuarios SET last_login = ? WHERE id = ?
  `, [new Date(), id])
}

const getUsers = async (id_empresa) => {
  const [rows] = await db.query(`
    SELECT id, username, nombres, apellidos FROM usuarios WHERE id_empresa = ?   
  `, [id_empresa])
  return rows
}

module.exports = { findUserByUsername, findUserByEmail, createUser, logUser, getUsers, deleteUserById };
