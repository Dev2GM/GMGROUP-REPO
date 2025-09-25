const express = require("express");
const router = express.Router();

const TareaController = require("../controllers/tarea.controller");
const Middleware = require("../middlewares/auth.middleware");

// Rutas
router.post("/", Middleware.authenticate, TareaController.createTarea);
router.get("/", Middleware.authenticate, TareaController.getTareas);
router.put("/:id", Middleware.authenticate, TareaController.updateTarea);

module.exports = router;