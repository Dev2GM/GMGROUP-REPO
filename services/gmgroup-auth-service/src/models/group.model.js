const db = require('../config/db');

// Crear grupo
const createGroup = async (group) => {
  const { nombre, descripcion } = group;

  const [result] = await db.query(
    `INSERT INTO Grupos (nombre, descripcion)
     VALUES (?, ?)`,
    [nombre, descripcion]
  );

  return { id: result.insertId, ...group };
};

// Eliminar grupo
const deleteGroupById = async (id) => {
  const [result] = await db.query(
    "DELETE FROM Grupos WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};

// Obtener todos los grupos de una empresa
const getGroupsByEmpresa = async (id_empresa) => {
  const [rows] = await db.query(
    `SELECT id, nombre, descripcion
     FROM Grupos
     WHERE id_empresa = ?`,
    [id_empresa]
  );
  return rows;
};

// 🔑 Obtener los grupos relacionados a un usuario
const getGroupsByUserId = async (id_usuario) => {
  const [rows] = await db.query(
    `SELECT g.id, g.nombre, g.descripcion
     FROM Grupos g
     INNER JOIN usuarios_grupos ug ON g.id = ug.id_grupo
     WHERE ug.id_usuario = ?`,
    [id_usuario]
  );
  return rows;
};

module.exports = {
  createGroup,
  deleteGroupById,
  getGroupsByUserId,
  getGroupsByEmpresa,
};
