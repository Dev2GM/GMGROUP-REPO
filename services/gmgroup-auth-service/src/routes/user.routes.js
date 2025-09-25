const express = require('express');
const router = express.Router();
const { getUsersController } = require('../controllers/user.controller');


router.get('/', getUsersController);

module.exports = router;
