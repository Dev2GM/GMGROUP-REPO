const express = require("express");
const router = express.Router();
const { getAutoData } = require("../controllers/autodata.controller");

router.get("/", getAutoData);

module.exports = router;
