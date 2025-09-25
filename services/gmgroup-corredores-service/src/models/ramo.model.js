const db = require('../config/db');

const Ramo = {
  // Obtener ramos por corredor_id
  getByCorredorId: (id_corredor, cb) =>
    db.query('SELECT * FROM Ramos WHERE id_corredor = ?', [id_corredor], cb),

  // CRUD opcional si luego quieres
  create: (data, cb) =>
    db.query(
      'INSERT INTO Ramos (nombre, descripcion, id_corredor) VALUES (?, ?, ?)',
      [data.nombre, data.descripcion, data.id_corredor],
      cb
    ),

  update: (id, data, cb) =>
    db.query(
      'UPDATE Ramos SET nombre=?, descripcion=? WHERE id=?',
      [data.nombre, data.descripcion, id],
      cb
    ),

  delete: (id, cb) =>
    db.query('DELETE FROM Ramos WHERE id = ?', [id], cb),
};

module.exports = Ramo;
