const express = require('express');
const router = express.Router();
const { getUsersController, getUsersBatchController } = require('../controllers/user.controller');
const serviceTokenMiddleware = require('../middlewares/serviceTokenMiddleware');

router.get('/', getUsersController);
router.post('/batch', serviceTokenMiddleware, getUsersBatchController);

module.exports = router;
