const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const template = require('./template');
const util = require('./util');

exports.myWebhook = functions.https.onRequest(async (request, response) => {
  const events = request.body.events;

  for (const event of events) {
    if (event.type === "beacon") {
      functions.logger.info("BODY", request.body)
      const userId= event.source.userId
      const profile = await util.getUserProfile(userId);
        console.log("PROFILE",profile)
      switch (event.beacon.type) {
          case "enter":
            let msg = template.enter1(profile);
            await util.reply(event.replyToken, [msg]);
            break;
      }
    }
  }

  response.end();
});
