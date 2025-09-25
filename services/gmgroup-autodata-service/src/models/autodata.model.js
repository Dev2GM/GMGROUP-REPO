const db = require("../config/db");

// Obtener todas las marcas con modelos y autos
const getAutoData = async () => {
  const [rows] = await db.query(`
    SELECT 
      ma.id AS marca_id, ma.nombre AS marca_nombre, ma.logo,
      mo.id AS modelo_id, mo.nombre AS modelo_nombre,
      au.id AS auto_id, au.anio,
      ta.id AS tipo_id, ta.nombre AS tipo_nombre, ta.descripcion AS tipo_descripcion
    FROM Marcas ma
    LEFT JOIN Modelos mo ON mo.id_marca = ma.id
    LEFT JOIN Autos au ON au.id_modelo = mo.id
    LEFT JOIN TiposAuto ta ON ta.id = au.id_tipo
    ORDER BY ma.nombre, mo.nombre, au.anio
  `);
  return rows;
};

module.exports = { getAutoData };
