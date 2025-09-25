const express = require("express");
const router = express.Router();
const DatosMonetarios = require("../controllers/datos-monetarios.controller");

router.get("/", DatosMonetarios.getDatosMonetarios);

module.exports = router;
