const db = require("../config/db");

const DatosMonetarios = {
    getDatosMonetarios: async (cb) => {
        try {
        // Monedas
        const [monedas] = await db.query("SELECT * FROM Monedas");

        // Métodos de pago
        const [metodos] = await db.query("SELECT * FROM MetodosPago");

        // Compañías con coberturas (LEFT JOIN)
        const [companiasRaw] = await db.query(`
            SELECT c.id AS compania_id, c.nombre AS compania_nombre, c.telefono, c.email, 
                c.direccion, c.web, c.cuit,
                co.id AS cobertura_id, co.nombre AS cobertura_nombre
            FROM Companias c
            LEFT JOIN Coberturas co ON co.id_compania = c.id
            ORDER BY c.id
        `);

        // Reestructurar compañías con coberturas
        const companiasMap = {};
        companiasRaw.forEach((row) => {
            if (!companiasMap[row.compania_id]) {
            companiasMap[row.compania_id] = {
                id: row.compania_id,
                nombre: row.compania_nombre,
                telefono: row.telefono,
                email: row.email,
                direccion: row.direccion,
                web: row.web,
                cuit: row.cuit,
                coberturas: []
            };
            }
            if (row.cobertura_id) {
            companiasMap[row.compania_id].coberturas.push({
                id: row.cobertura_id,
                nombre: row.cobertura_nombre
            });
            }
        });

        const companias = Object.values(companiasMap);

        cb(null, {
            monedas,
            metodos,
            companias
        });
        } catch (err) {
        cb(err, null);
        }
    }
};


module.exports = DatosMonetarios;
