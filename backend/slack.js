var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var bot_token = process.env.SLACK_BOT_TOKEN || '';

var rtm = new RtmClient(bot_token);

let channel = 'D7Q6BLS30';

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  console.log(message);
  console.log(
    'User %s posted a message in %s channel',
    rtm.dataStore.getUserById(message.user).name,
    rtm.dataStore.getChannelGroupOrDMById(message.channel).name
  );
  rtm.sendMessage('Hey there!',channel)
});

rtm.start();
