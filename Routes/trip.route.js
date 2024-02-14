const tripService = require("../Controllers/trip.controller");
const express = require("express");

const router = express.Router();

router.route("/newTrip").post(tripService.newTrip);

module.exports = router;
