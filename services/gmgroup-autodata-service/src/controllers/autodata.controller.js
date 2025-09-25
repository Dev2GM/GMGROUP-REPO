const AutoData = require("../models/autodata.model");

const getAutoData = async (req, res) => {
  try {
    const rows = await AutoData.getAutoData();

    // Reestructurar la data en JSON anidado
    const marcasMap = {};

    rows.forEach(r => {
      if (!marcasMap[r.marca_id]) {
        marcasMap[r.marca_id] = {
          id: r.marca_id,
          nombre: r.marca_nombre,
          logo: r.logo,
          modelos: {}
        };
      }

      if (r.modelo_id && !marcasMap[r.marca_id].modelos[r.modelo_id]) {
        marcasMap[r.marca_id].modelos[r.modelo_id] = {
          id: r.modelo_id,
          nombre: r.modelo_nombre,
          autos: []
        };
      }

      if (r.auto_id) {
        marcasMap[r.marca_id].modelos[r.modelo_id].autos.push({
          id: r.auto_id,
          anio: r.anio,
          tipo: r.tipo_id ? {
            id: r.tipo_id,
            nombre: r.tipo_nombre,
            descripcion: r.tipo_descripcion
          } : null
        });
      }
    });

    // Convertir de objeto → array
    const marcas = Object.values(marcasMap).map(marca => ({
      ...marca,
      modelos: Object.values(marca.modelos)
    }));

    res.json(marcas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las marcas" });
  }
};

module.exports = { getAutoData };
