const db = require('../config/db');

const Corredor = {
  getAll: cb => db.query('SELECT * FROM corredores', cb),

  getById: (id, cb) =>
    db.query('SELECT * FROM corredores WHERE id = ?', [id], cb),

  create: (data, cb) =>
    db.query(
      'INSERT INTO corredores (nombre, telefono, email, direccion, direccion2, horario) VALUES (?, ?, ?, ?, ?, ?)',
      [data.nombre, data.telefono, data.email, data.direccion, data.direccion2, data.horario],
      cb
    ),

  update: (id, data, cb) =>
    db.query(
      'UPDATE corredores SET nombre=?, telefono=?, email=?, direccion=?, direccion2=?, horario=? WHERE id=?',
      [data.nombre, data.telefono, data.email, data.direccion, data.direccion2, data.horario, id],
      cb
    ),

  delete: (id, cb) =>
    db.query('DELETE FROM corredores WHERE id = ?', [id], cb),
};

module.exports = Corredor;
