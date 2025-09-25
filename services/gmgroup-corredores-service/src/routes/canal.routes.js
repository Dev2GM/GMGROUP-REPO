const express = require("express");
const router = express.Router();
const canalController = require("../controllers/canal.controller");

router.get("/filtrar", canalController.filterByCorredor);

router.get("/", canalController.getAll);
router.get("/:id", canalController.getById);
router.post("/", canalController.create);
router.put("/:id", canalController.update);
router.delete("/:id", canalController.delete);

// Extra: filtrar por corredor con req.query
// Ejemplo: GET /api/canales/filter?id_corredor=1

module.exports = router;
