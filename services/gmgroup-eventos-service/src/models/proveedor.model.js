import pool from "../config/db.js";

const Proveedor = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM proveedores");
    return rows;
  },
  async create(data) {
    const { id_persona, categoria, descripcion } = data;

    const [result] = await pool.query(
      `INSERT INTO proveedores (id_persona, categoria, descripcion, created_at, updated_at) 
       VALUES (?, ?, ?, NOW(), NOW())`,
      [id_persona, categoria, descripcion]
    );

    return { id: result.insertId, ...data };
  },
  async addCalificacion(id, { estrellas, comentario }, id_usuario) {
    const [result] = await pool.query(
      "INSERT INTO calificaciones (id_proveedor, estrellas, comentario, id_usuario) VALUES (?, ?, ?, ?)",
      [id, estrellas, comentario, id_usuario]
    );
    return result.insertId;
  },
  async updateCalificacion (id, { estrellas, comentario }, id_usuario) {
    const [result] = await pool.query(
      "UPDATE calificaciones SET estrellas = ?, comentario = ? WHERE id_proveedor = ? AND id_usuario = ?",
      [estrellas, comentario, id, id_usuario]
    );
    return result.insertId;
  },
  async getCalificaciones(id) {
    const [rows] = await pool.query(
      "SELECT * FROM calificaciones WHERE id_proveedor = ?",
      [id]
    );
    return rows;
  },
  async haCalificado(id_proveedor, id_usuario) {
    const [rows] = await pool.query(
      "SELECT * FROM calificaciones WHERE id_proveedor = ? AND id_usuario = ?",
      [id_proveedor, id_usuario]
    );
    return rows;
  }
};

export default Proveedor;
