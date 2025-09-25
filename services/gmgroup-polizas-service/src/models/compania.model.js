const db = require("../config/db");

const Compania = {
  getAll: (cb) => db.query("SELECT * FROM Companias", cb),

  getById: (id, cb) =>
    db.query("SELECT * FROM Companias WHERE id = ?", [id], cb),

  create: (data, cb) =>
    db.query(
      "INSERT INTO Companias (nombre, telefono, email, direccion, web, cuit) VALUES (?, ?, ?, ?, ?, ?)",
      [data.nombre, data.telefono, data.email, data.direccion, data.web, data.cuit],
      cb
    ),

  update: (id, data, cb) =>
    db.query(
      "UPDATE Companias SET nombre=?, telefono=?, email=?, direccion=?, web=?, cuit=? WHERE id=?",
      [data.nombre, data.telefono, data.email, data.direccion, data.web, data.cuit, id],
      cb
    ),

  delete: (id, cb) =>
    db.query("DELETE FROM Companias WHERE id = ?", [id], cb),
};

module.exports = Compania;
