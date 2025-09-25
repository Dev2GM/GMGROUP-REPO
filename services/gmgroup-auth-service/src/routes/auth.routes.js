const express = require('express');
const router = express.Router();
const { register, login, logout, verify, getUserIdByUsername } = require('../controllers/auth.controller');


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify', verify);

router.get("/:username", getUserIdByUsername);

module.exports = router;
