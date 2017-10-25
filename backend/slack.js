var RtmClient = require('@slack/client').RtmClient;
var ChatClient = require('@slack/client').ChatClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var schedule = require('node-schedule');
const dfRequest = require('./dfRequest');

const bot_token = process.env.SLACK_BOT_TOKEN || '';
const rtm = new RtmClient(bot_token);

// let channel = 'D7Q6BLS30'; // Nate-Bot
const channel = 'D7Q8QTULE'; // Jeff-Bot
const bot_user_id = 'U7NPK6TEV'

// why is the last message always logged on start?
// rtm.on(RTM_EVENTS.MESSAGE, (message) => {
//   dfRequest(message.text, message.ts)
//     .then(response => {
//       console.log('Dialog response',response);
//       const msg = response.result.fulfillment.speech;
//       // rtm.sendMessage(msg, channel);
//     })
//     .catch(err => {
//       console.log('DF err',err);
//     })
// });
//
//
// rtm.start();
