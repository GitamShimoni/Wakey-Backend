const callService = require("../Controllers/calls.controller");
const express = require("express");

const router = express.Router();

router.route("/callToNumber").get(callService.CallToSpecifiedNumber);
// router.route("/callNumber").get(callService.callNumber);

module.exports = router;
