const tripService = require("../Controllers/trip.controller");
const express = require("express");

const router = express.Router();

router.route("/newTrip").post(tripService.newTrip);
router.route("/finishLastTrip").get(tripService.finishLastTrip);
router.route("/getTripById").get(tripService.getTripById);

module.exports = router;
