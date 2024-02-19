// const accountSid = process.env.TWILIO_ACCOUNT_SID;
const accountSid = "AC4fc029c86a2859b0ecc35fbf4225dac0";
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const authToken = "512506e3c52fc8b716bc7489e1c989d9";
const client = require("twilio")(accountSid, authToken);

client.validationRequests
  .create({ friendlyName: "My personal phone", phoneNumber: "+9720532312574" })
  .then((validation_request) => console.log(validation_request.friendlyName));
