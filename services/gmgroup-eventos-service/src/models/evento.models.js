import pool from "../config/db.js";

const Evento = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT * 
      FROM eventos
      WHERE STR_TO_DATE(CONCAT(fecha, ' ', hora), '%Y-%m-%d %H:%i:%s') >= NOW()
      ORDER BY fecha, hora`
    );
    return rows;
  },
  async create(data, id_usuario) {
    const { titulo, descripcion, fecha, hora, lugar, organizador, imagen } = data;
    const [result] = await pool.query(
      `INSERT INTO eventos (titulo, descripcion, fecha, hora, lugar, organizador, imagen, id_usuario)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo, descripcion, fecha, hora, lugar, organizador, imagen, id_usuario]
    );
    return { id: result.insertId, ...data };
  }
};

export default Evento;
