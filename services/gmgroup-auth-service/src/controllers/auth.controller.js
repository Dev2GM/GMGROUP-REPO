const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { findUserByUsername, findUserByEmail, createUser, logUser, deleteUserById } = require('../models/user.model');
const { createSession, closeSessions, closeSession, getSession } = require("../models/session.model")
const jwt = require('jsonwebtoken');
require('dotenv').config();
const axios = require("axios")

/**
 * Endpoint para el registro de nuevos usuarios
 * 
 * No puede duplicarse el username ni el email
 * 
 * La contraseña ingresa encriptada a la BBDD
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const register = async (req, res) => {
  const { username, password, nombres, apellidos, email, fecha_nacimiento, telefono, id_empresa, persona } = req.body;

  try {
    // Validaciones básicas
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'username, password y email son requeridos' });
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) return res.status(409).json({ message: 'El usuario ya existe' });

    const existingEmail = await findUserByEmail(email);
    if (existingEmail) return res.status(409).json({ message: 'El correo ya se encuentra registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      username,
      password_hash: hashedPassword,
      nombres,
      apellidos,
      email,
      fecha_nacimiento,
      telefono,
      id_empresa
    });
    // Obtener id del usuario recién creado (ajusta según tu createUser)
    const userId = newUser.insertId || newUser.id;

    // Si llegó objeto persona, llamamos al servicio personas para link/create
    if (persona) {
      try {
        await axios.post(
          `${process.env.API_URL}/api/personas/link-or-create`,
          { id_usuario: userId, persona },
          { headers: { 'x-service-token': process.env.SERVICE_INTERNAL_TOKEN } }
        );
      } catch (err) {
        console.error('Error creando/vinculando persona:', err.message);

        // Opción A: intentar rollback del usuario (si quieres consistencia fuerte)
        try {
          await deleteUserById(userId);
          return res.status(500).json({ message: 'Error creando persona; usuario eliminado para evitar inconsistencia' });
        } catch (delErr) {
          console.error('Error borrando usuario después de fallo persona:', delErr.message);
          // Opción B: informar creación parcial
          return res.status(201).json({
            message: 'Usuario creado pero falló la creación/vinculación de persona; revisa logs',
            userId
          });
        }
      }
    }

    res.status(201).json({ message: 'Usuario creado con éxito', userId });
  } catch (err) {
    console.error('Error register:', err);
    res.status(500).json({ message: 'Error al crear usuario', error: err.message });
  }
};

/**
 * Endpoint para loggear al usuario
 * 
 * Crea una sesion y cierra las sesiones abiertas
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns JWT
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'El usuario no existe' }); // Not found
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'La contraseña es incorrecta' }); // Unauthorized
    }

    // Token de acceso
    const token = generateToken(user);

    await closeSessions(user.id);

    await logUser(user.id);

    await createSession({
      id_usuario: user.id,
      token_jwt: token
    })

    res.status(200).json({
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.body;
    await closeSession(token)
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}


const verify = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token no enviado" });
  }

  try {
    // verificar firma JWT
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)
    // buscar en BD si el token existe y está activo
    const tokenRecord = await getSession(token);
    if (!tokenRecord) {
      console.log("No hay sesion para " + token)
      return res.status(401).json({ message: "Token inválido o revocado" });
    }

    res.json({ valid: true, user: { id: tokenRecord.id_usuario, username: tokenRecord.username, id_empresa: tokenRecord.id_empresa } });
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

const getUserIdByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "El username es requerido"
      });
    }

    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      id: user.id
    });
  } catch (error) {
    console.error("Error en getUserIdByUsername:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};

module.exports = { register, login, verify, getUserIdByUsername, logout };
