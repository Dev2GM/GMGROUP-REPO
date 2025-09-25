const express = require('express');
const router = express.Router();
const personaCtrl = require('../controllers/persona.controller');
const Middleware = require('../middlewares/auth.middleware');

router.get("/by-usuario/:id_usuario", Middleware.authenticate, personaCtrl.getByUsuarioId);
router.post("/by-usuarios", Middleware.authenticate, personaCtrl.getPersonasByUsuarios);
router.get('/buscar', Middleware.authenticate, personaCtrl.search);
router.get('/filtrar', Middleware.authenticate, personaCtrl.filter);
router.post('/upsert', Middleware.authenticate, personaCtrl.upsert);
router.post("/batch", Middleware.authenticate, personaCtrl.getBatch);
router.post('/link-or-create', Middleware.authenticate, personaCtrl.linkOrCreate);

router.get('/', Middleware.authenticate, personaCtrl.getAll);
router.get('/:id', Middleware.authenticate, personaCtrl.getById);
router.post('/', Middleware.authenticate, personaCtrl.create);
router.put('/:id', Middleware.authenticate, personaCtrl.update);
router.delete('/:id', Middleware.authenticate, personaCtrl.delete);


module.exports = router;
