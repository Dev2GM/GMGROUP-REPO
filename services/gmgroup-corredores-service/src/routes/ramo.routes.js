const express = require('express');
const router = express.Router();
const controller = require('../controllers/ramo.controller');
const authenticate = require('../middlewares/auth.middleware');

// router.use(authenticate);

// Obtener todos los ramos de un corredor
router.get('/filter/:id_corredor', controller.getByCorredorId);

// CRUD opcional
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
