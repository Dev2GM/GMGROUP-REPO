const db = require('../config/db');

const Persona = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM Personas');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM Personas WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (data) => {
    const [result] = await db.query(
      `INSERT INTO Personas (tipo, nombres, apellidos, genero, documento, telefono, direccion, email, fecha_nacimiento, foto, id_corredor, id_ciudad, es_cliente, id_usuario)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.tipo,
        data.nombres,
        data.apellidos,
        data.genero,
        data.documento,
        data.telefono,
        data.direccion,
        data.email,
        data.fecha_nacimiento,
        data.foto,
        data.id_corredor,
        data.id_ciudad,
        data.es_cliente,
        data.id_usuario,
      ]
    );
    return result;
  },

  update: async (id, data) => {
    const [result] = await db.query(
      `UPDATE Personas 
       SET tipo=?, nombres=?, apellidos=?, genero=?, documento=?, telefono=?, direccion=?, email=?, fecha_nacimiento=?, foto=?, id_corredor=?, id_ciudad=?, es_cliente=? 
       WHERE id=?`,
      [
        data.tipo,
        data.nombres,
        data.apellidos,
        data.genero,
        data.documento,
        data.telefono,
        data.direccion,
        data.email,
        data.fecha_nacimiento,
        data.foto,
        data.id_corredor,
        data.id_ciudad,
        data.es_cliente,
        id,
      ]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM Personas WHERE id = ?', [id]);
    return result;
  },

  searchByCorredor: async (id_corredor, query) => {
    const likeQuery = `%${query}%`;
    const [rows] = await db.query(
      `SELECT * FROM Personas
       WHERE id_corredor = ?
       AND (
         nombres LIKE ? OR
         apellidos LIKE ? OR
         direccion LIKE ? OR
         email LIKE ? OR
         documento LIKE ?
       )`,
      [Number(id_corredor), likeQuery, likeQuery, likeQuery, likeQuery, likeQuery]
    );
    return rows;
  },

  filter: async (cedula, id_corredor, tipo, cb) => {
    try {
      let query = `SELECT 
            p.*,
            c.id AS id_ciudad,
            d.id AS id_departamento,
            pa.id AS id_pais
        FROM Personas p
        LEFT JOIN Ciudades c ON p.id_ciudad = c.id
        LEFT JOIN Departamentos d ON c.id_departamento = d.id
        LEFT JOIN Paises pa ON d.id_pais = pa.id
        WHERE p.documento = ? AND p.id_corredor = ?`
      let params = [cedula, id_corredor]
      if (tipo) {
        query += " AND p.tipo = ?"
        params.push(tipo)
      }
      const [rows] = await db.query(
        query,
        params
      );
      cb(null, rows);
    } catch (err) {
      cb(err, null);
    }
  },
  getByUsuarioId: async (id_usuario) => {
    const [rows] = await db.query(
      "SELECT * FROM Personas WHERE id_usuario = ? LIMIT 1",
      [id_usuario]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  getAllBatch: async (ids, cb) => {
    try {
      const [rows] = await db.query(
        `SELECT * FROM Personas WHERE id IN (?)`,
        [ids]
      );
      cb(null, rows)
    } catch (error) {
      cb(err, null);
    }
  },
  findByDocumentoOrEmail: async (documento, email) => {
    const [rows] = await db.query(
      'SELECT * FROM Personas WHERE documento = ? OR email = ? LIMIT 1',
      [documento, email]
    );
    return rows[0] || null;
  },

  // Operación atómica: busca por documento|email, si existe -> update id_usuario,
  // si no existe -> insert con id_usuario
  linkOrCreateAndLinkUser: async (personaData, id_usuario) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const documento = personaData.documento || null;
      const email = personaData.email || null;

      const [rows] = await connection.query(
        'SELECT * FROM Personas WHERE documento = ? OR email = ? LIMIT 1',
        [documento, email]
      );

      let persona;
      if (rows.length > 0) {
        persona = rows[0];
        // Actualizar id_usuario si es null o si queremos sobrescribir
        if (!persona.id_usuario || persona.id_usuario !== id_usuario) {
          await connection.query(
            'UPDATE Personas SET id_usuario = ? WHERE id = ?',
            [id_usuario, persona.id]
          );
          persona.id_usuario = id_usuario;
        }
      } else {
        // Insertar nueva persona con id_usuario
        const [
          result
        ] = await connection.query(
          `INSERT INTO Personas
           (tipo, nombres, apellidos, genero, documento, telefono, direccion, email, fecha_nacimiento, foto, id_corredor, id_ciudad, id_usuario, es_cliente)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            personaData.tipo || 'Fisica',
            personaData.nombres,
            personaData.apellidos || null,
            personaData.genero || null,
            documento,
            personaData.telefono || null,
            personaData.direccion || null,
            email,
            personaData.fecha_nacimiento || null,
            personaData.foto || null,
            personaData.id_corredor || null,
            personaData.id_ciudad || null,
            id_usuario,
            personaData.es_cliente ? 1 : 0
          ]
        );
        persona = {
          id: result.insertId,
          ...personaData,
          id_usuario
        };
      }

      await connection.commit();
      return persona;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
  getByUsuarios: async (idsUsuarios) => {
    if (!idsUsuarios || idsUsuarios.length === 0) return [];

    const placeholders = idsUsuarios.map(() => "?").join(",");
    const [rows] = await db.query(
      `SELECT * FROM personas WHERE id_usuario IN (${placeholders})`,
      idsUsuarios
    );

    return rows;
  },

};

module.exports = Persona;
