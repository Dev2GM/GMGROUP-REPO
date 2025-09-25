const express = require('express');
const router = express.Router();
const { getUserGroups, getEmpresaGroups } = require('../controllers/group.controller');
const { authenticate } = require("../middlewares/auth.middleware")

router.get('/', authenticate, getEmpresaGroups);

module.exports = router;
