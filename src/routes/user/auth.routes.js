const express = require("express");
const router = express.Router();

const {authorizeUser} = require("../../middlewares/authorizeUser");

const {registerUser, loginUser} = require("../../controllers/auth.controller");

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

module.exports = router