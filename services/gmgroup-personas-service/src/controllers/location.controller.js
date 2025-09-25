const Location = require('../models/location.model');

// exports.getPaises = (req, res) => {
//   Pais.getAll((err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(result);
//   });
// };

exports.getLocations = async (req, res) => {
  try {
    const data = await Location.getLocations();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
