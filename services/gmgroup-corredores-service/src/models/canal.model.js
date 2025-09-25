const db = require("../config/db");

const Canal = {
  getAll: (cb) => db.query("SELECT * FROM Canales", cb),

  getById: (id, cb) =>
    db.query("SELECT * FROM Canales WHERE id = ?", [id], cb),

  create: (data, cb) =>
    db.query(
      "INSERT INTO Canales (nombre, descripcion, id_corredor) VALUES (?, ?, ?)",
      [data.nombre, data.descripcion, data.id_corredor],
      cb
    ),

  update: (id, data, cb) =>
    db.query(
      "UPDATE Canales SET nombre = ?, descripcion = ?, id_corredor = ? WHERE id = ?",
      [data.nombre, data.descripcion, data.id_corredor, id],
      cb
    ),

  delete: (id, cb) =>
    db.query("DELETE FROM Canales WHERE id = ?", [id], cb),

  filterByCorredor: (id_corredor, cb) =>
    db.query("SELECT * FROM Canales WHERE id_corredor = ?", [id_corredor], cb),
};

module.exports = Canal;
