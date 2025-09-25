const db = require("../config/db");

const Categoria = {
  getAll: async (cb) => {
    try {
      const [rows] = await db.query("SELECT * FROM Categorias");
      cb(null, rows);
    } catch (err) {
      cb(err, null);
    }
  }
};

module.exports = Categoria;
