var RtmClient = require('@slack/client').RtmClient;
var ChatClient = require('@slack/client').ChatClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var schedule = require('node-schedule');

var bot_token = process.env.SLACK_BOT_TOKEN || '';

var rtm = new RtmClient(bot_token);

// let channel = 'D7Q6BLS30'; // Nate-Bot
let channel = 'D7Q8QTULE'; // Jeff-Bot

// why is the last message always logged on start?
rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  console.log(`user: ${message.user}, text: ${message.text}, channel: ${message.channel}`);
  rtm.sendMessage('hello world', channel);
});


rtm.start();
