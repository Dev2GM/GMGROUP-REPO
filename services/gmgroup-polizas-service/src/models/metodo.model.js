const db = require("../config/db");

const MetodoPago = {
  getAll: (cb) => db.query("SELECT * FROM MetodosPago", cb),

  getById: (id, cb) =>
    db.query("SELECT * FROM MetodosPago WHERE id = ?", [id], cb),

  create: (data, cb) =>
    db.query(
      "INSERT INTO MetodosPago (nombre, descripcion) VALUES (?, ?)",
      [data.nombre, data.descripcion],
      cb
    ),

  update: (id, data, cb) =>
    db.query(
      "UPDATE MetodosPago SET nombre=?, descripcion=? WHERE id=?",
      [data.nombre, data.descripcion, id],
      cb
    ),

  delete: (id, cb) =>
    db.query("DELETE FROM MetodosPago WHERE id = ?", [id], cb),
};

module.exports = MetodoPago;
