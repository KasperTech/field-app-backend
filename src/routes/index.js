const express = require('express');
const router = express.Router();

const serverTestRoutes = require('./serverTest/serverTest.routes')
const fieldUserRoutes = require("./user/index.routes")

router.use('/server/test', serverTestRoutes)
router.use('/field-user', fieldUserRoutes)

module.exports = router