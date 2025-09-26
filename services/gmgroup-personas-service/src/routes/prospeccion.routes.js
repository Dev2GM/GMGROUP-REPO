const express = require('express');
const router = express.Router();
const controller = require('../controllers/prospeccion.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/', auth.authenticate, controller.createProspeccion);
router.get('/', auth.authenticate, controller.getProspecciones);
router.get('/:id', auth.authenticate, controller.getProspeccionById);
router.put('/:id', auth.authenticate, controller.updateProspeccion);
router.delete('/:id', auth.authenticate, controller.deleteProspeccion);

module.exports = router;
