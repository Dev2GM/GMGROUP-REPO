const express = require("express");
const router = express.Router();
const controller = require("../controllers/poliza.controller");

// POST /polizas → crea poliza y cuotas
router.post("/", controller.create);

module.exports = router;
