const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const helmet = require("helmet");
// const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const unauthenticatedRoutes = require("./Routes/unauthenticated.route");
const userRoutes = require("./Routes/user.route");
const tripRoutes = require("./Routes/trip.route");
const phonecallsRoutes = require("./Routes/calls.route");

const { MONGOATLAS } = process.env;
mongoose
  .connect(MONGOATLAS, {})
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("Unable to connect to MongoDB Atlas");
    console.error(err);
  });

app.use(
  cors(),
  express.json()
  // helmet(), cookieParser()
);

app.use("/unauth", unauthenticatedRoutes);
app.use("/users", userRoutes);
app.use("/trips", tripRoutes);
app.use("/phonecall", phonecallsRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
