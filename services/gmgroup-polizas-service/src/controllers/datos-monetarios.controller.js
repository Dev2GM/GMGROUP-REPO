const DatosMonetarios = require("../models/datos-monetarios.model");

exports.getDatosMonetarios = (req, res) => {
  DatosMonetarios.getDatosMonetarios((err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Error al obtener datos" });
    }
    res.json({ success: true, data });
  });
};
