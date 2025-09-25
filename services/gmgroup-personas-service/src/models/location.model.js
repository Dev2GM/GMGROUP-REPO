const db = require('../config/db');

const Location = {
//   getAll: (cb) => {
//     db.query('SELECT * FROM Paises', cb);
//   },

//   getById: (id, cb) => {
//     db.query('SELECT * FROM Paises WHERE id = ?', [id], cb);
//   },

//   create: (data, cb) => {
//     db.query(
//       'INSERT INTO Paises (nombre) VALUES (?)',
//       [data.nombre],
//       cb
//     );
//   },

//   update: (id, data, cb) => {
//     db.query(
//       'UPDATE Paises SET nombre=? WHERE id=?',
//       [data.nombre, id],
//       cb
//     );
//   },

//   delete: (id, cb) => {
//     db.query('DELETE FROM Paises WHERE id=?', [id], cb);
//   },

  getLocations: async () => {
    const [rows] = await db.query(`
      SELECT 
        p.id as pais_id, p.nombre as pais_nombre,
        d.id as depto_id, d.nombre as depto_nombre,
        c.id as ciudad_id, c.nombre as ciudad_nombre
      FROM Paises p
      LEFT JOIN Departamentos d ON d.id_pais = p.id
      LEFT JOIN Ciudades c ON c.id_departamento = d.id
      ORDER BY p.nombre, d.nombre, c.nombre
    `);

    // Armar JSON jerárquico
    const result = [];
    const paisMap = {};

    rows.forEach(row => {
      if (!paisMap[row.pais_id]) {
        paisMap[row.pais_id] = {
          id: row.pais_id,
          nombre: row.pais_nombre,
          departamentos: []
        };
        result.push(paisMap[row.pais_id]);
      }

      if (row.depto_id) {
        let depto = paisMap[row.pais_id].departamentos.find(d => d.id === row.depto_id);
        if (!depto) {
          depto = {
            id: row.depto_id,
            nombre: row.depto_nombre,
            ciudades: []
          };
          paisMap[row.pais_id].departamentos.push(depto);
        }

        if (row.ciudad_id) {
          depto.ciudades.push({
            id: row.ciudad_id,
            nombre: row.ciudad_nombre
          });
        }
      }
    });

    return result;
  }
};

module.exports = Location;
