const express = require("express");
const router = express.Router();

// different model routers
router.use("/people", require("./people"));

module.exports = router;