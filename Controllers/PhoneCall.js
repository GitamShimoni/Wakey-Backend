const client = require("twilio")(accountSid, authToken);

const phoneNumber = "532312574";
try {
  client.calls
    .create({
      url: "https://handler.twilio.com/twiml/EH008a267cf0994694bc1b100e920217f2",
      to: `+972${phoneNumber}`,
      from: "+97233820952",
    })
    .then((call) => console.log(call))
    .catch((error) => console.error("Error making the call:", error.message));
} catch (error) {
  console.error("Error:", error.message);
}
