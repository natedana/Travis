var RtmClient = require('@slack/client').RtmClient;
var ChatClient = require('@slack/client').ChatClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var axios = require('axios');
var bot_token = process.env.SLACK_BOT_TOKEN || '';

var rtm = new RtmClient(bot_token);

let channel = 'D7Q6BLS30';

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  // console.log(message);
  // if (message.user === 'U7NPK6TEV') {
  //   return
  // }
  console.log('User %s posted a message in %s channel', rtm.dataStore.getUserById(message.user).name, rtm.dataStore.getChannelGroupOrDMById(message.channel).name);
  rtm.sendMessage('test send', channel)
  // rtm.postMessage('test post', channel)
  rtm.send(testMsg, channel)
});

rtm.start();
