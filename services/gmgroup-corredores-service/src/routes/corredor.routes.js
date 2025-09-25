const express = require('express');
const router = express.Router();
const controller = require('../controllers/corredor.controller');
const Middleware = require('../middlewares/auth.middleware');

// router.use(authenticate);

router.get('/', Middleware.authenticate, controller.getAll);
router.get('/:id', Middleware.authenticate, controller.getById);
router.post('/', Middleware.authenticate, controller.create);
router.put('/:id', Middleware.authenticate, controller.update);
router.delete('/:id', Middleware.authenticate, controller.delete);

module.exports = router;
