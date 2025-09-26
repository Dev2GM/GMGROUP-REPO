require('dotenv').config();
const { getUsers, findUserByUsername } = require('../models/user.model');
const { getSession } = require('../models/session.model');


const getUsersController = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }
    const token = authHeader.split(" ")[1];

    const tokenRecord = await getSession(token);
    if (!tokenRecord) {
      return res.status(401).json({ message: "Token inválido o revocado" });
    }

    const user = await findUserByUsername(tokenRecord.username)

    const users = await getUsers(user.id_empresa);

    if (!users) {
      return res.status(401).json({ message: "Error en el servidor" });
    } else {
        return res.status(200).json({ users });
    }
    
  } catch (error) {
    console.error("Error en getUserIdByUsername:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};

const getUsersBatchController = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Debes enviar un array de ids' });
    }
    // Obtener usuarios por id
    const db = require('../config/db');
    const [rows] = await db.query(
      `SELECT id, nombres, apellidos, username FROM usuarios WHERE id IN (${ids.map(() => '?').join(',')})`,
      ids
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsersController, getUsersBatchController };