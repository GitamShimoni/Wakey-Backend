const userService = require("../Controllers/user.controller");
const express = require("express");

const router = express.Router();

router.route("/getUser").post(userService.getUser);
router.route("/getUserByUsername").post(userService.getUserByUsername);
router.route("/getUsers").post(userService.getUsers);
router.route("/addAfriend").post(userService.addAFriend);

module.exports = router;
