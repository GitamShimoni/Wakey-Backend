// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

client.validationRequests
  .create({ friendlyName: "My personal phone", phoneNumber: "+9720532312574" })
  .then((validation_request) => console.log(validation_request.friendlyName));
