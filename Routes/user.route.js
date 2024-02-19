const userService = require("../Controllers/user.controller");
const express = require("express");

const router = express.Router();

router.route("/getUser").get(userService.getUser);
router.route("/getUserByUsername").post(userService.getUserByUsername);
router
  .route("/changeIsUserSleepingToTrue")
  .get(userService.changeIsUserSleepingToTrue);
router
  .route("/changeIsUserSleepingToFalse")
  .get(userService.changeIsUserSleepingToFalse);
router.route("/isUserSleeping").get(userService.isUserSleeping);
router.route("/updateVoice").get(userService.changeCallingVoice);
router.route("/getUsers").post(userService.getUsers);
router.route("/addAfriend").post(userService.addAFriend);

module.exports = router;
