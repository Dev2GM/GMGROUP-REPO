const db = require("../config/db");

const Moneda = {
  getAll: (cb) => db.query("SELECT * FROM Monedas", cb),

  getById: (id, cb) =>
    db.query("SELECT * FROM Monedas WHERE id = ?", [id], cb),

  create: (data, cb) =>
    db.query(
      "INSERT INTO Monedas (codigo_iso, nombre, simbolo, tasa_cambio, estado) VALUES (?, ?, ?, ?, ?)",
      [data.codigo_iso, data.nombre, data.simbolo, data.tasa_cambio, data.estado ?? true],
      cb
    ),

  update: (id, data, cb) =>
    db.query(
      "UPDATE Monedas SET codigo_iso=?, nombre=?, simbolo=?, tasa_cambio=?, estado=? WHERE id=?",
      [data.codigo_iso, data.nombre, data.simbolo, data.tasa_cambio, data.estado, id],
      cb
    ),

  delete: (id, cb) =>
    db.query("DELETE FROM Monedas WHERE id = ?", [id], cb),
};

module.exports = Moneda;
