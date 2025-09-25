const express = require('express');
const router = express.Router();
const locationCtrl = require('../controllers/location.controller');
const Middleware = require('../middlewares/auth.middleware');


router.get('/', locationCtrl.getLocations);


module.exports = router;
