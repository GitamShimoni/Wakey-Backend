const Trip = require("../Models/trip");
const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const { ModuleNode } = require("vite");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
console.log(accountSid, authToken, "These are te tokens");
const client = require("twilio")(accountSid, authToken);

const wakeupVoices = [
  "https://handler.twilio.com/twiml/EH7aff944b554e2f30c64b4c8b5b776121",
  "https://handler.twilio.com/twiml/EHe16faacd984943eb69b0dd0a12bae51c",
  "https://handler.twilio.com/twiml/EH62517fc2dabde25dd160ce3add53697f",
];

const CallToSpecifiedNumber = async (req, res) => {
  let chosenVoice = req.headers.voicetype;
  console.log("Thoe chosen voice is ", chosenVoice);
  try {
    if (!accountSid || !authToken) {
      throw new Error("Twilio credentials not configured");
    }
    if (chosenVoice && chosenVoice >= 0 && chosenVoice <= 2) {
      console.log("Got into if");
      chosenVoice = wakeupVoices[chosenVoice];
    } else {
      console.log("got into else");
      chosenVoice = wakeupVoices[0];
    }
    console.log(chosenVoice);
    const realId = jwt.verify(req.headers.token, process.env.SECRET);
    const user = await User.findOne({ _id: realId.id });
    const userPhoneNumber = user.phoneNumber.substring(1);
    console.log(userPhoneNumber, "This is the phoneNumber");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Couldn't find user, please try again" });
    } else {
      let responseMessage;
      try {
        client.calls
          .create({
            // url: "https://handler.twilio.com/twiml/EH008a267cf0994694bc1b100e920217f2",
            url: `${chosenVoice}`,
            to: `+972${userPhoneNumber}`,
            from: "+97233820952",
          })
          .then((call) => console.log(call))
          .catch((error) =>
            console.error("Error making the call:", error.message)
          );
      } catch (error) {
        console.error("Error:", error.message);
      }
      return res.status(202).json(responseMessage);
    }
  } catch (err) {
    res.status(501).send(err);
  }
};

const callNumber = async (req, res) => {
  try {
    // const userPhoneNumber = "532312574";
    const userPhoneNumber = "542249112";
    console.log(userPhoneNumber, "This is the phoneNumber");
    let responseMessage;
    try {
      client.calls
        .create({
          url: "https://handler.twilio.com/twiml/EH008a267cf0994694bc1b100e920217f2",
          to: `+972${userPhoneNumber}`,
          from: "+97233820952",
        })
        .then((call) => console.log(call))
        .catch((error) =>
          console.error("Error making the call:", error.message)
        );
    } catch (error) {
      console.error("Error:", error.message);
    }
    return res.status(202).json(responseMessage);
  } catch (err) {
    res.status(501).send(err);
  }
};

module.exports = { CallToSpecifiedNumber, callNumber };
