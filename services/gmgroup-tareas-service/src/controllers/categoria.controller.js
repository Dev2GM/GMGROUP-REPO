const Categoria = require("../models/categoria.model");

exports.getCategorias = (req, res) => {
  Categoria.getAll((err, data) => {
    if (err) {
      console.error("Error al obtener categorías:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener categorías"
      });
    }
    res.status(200).json({
      success: true,
      data
    });
  });
};
