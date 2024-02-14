const authController = require("../Controllers/authenticate.controller");
const express = require("express");

const router = express.Router();

router.route("/login").post(authController.login);
router.route("/register").post(authController.register);

module.exports = router;
