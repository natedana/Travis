var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var axios = require('axios');
var bot_token = process.env.SLACK_BOT_TOKEN || '';

var rtm = new RtmClient(bot_token);

let channel = 'D7Q6BLS30';
const testMsg = {
  "text": "Would you like to play a game?",
  "attachments": [
    {
      "text": "Choose a game to play",
      "fallback": "You are unable to choose a game",
      "callback_id": "wopr_game",
      "color": "#3AA3E3",
      "attachment_type": "default",
      "actions": [
        {
          "name": "game",
          "text": "Chess",
          "type": "button",
          "value": "chess"
        }, {
          "name": "game",
          "text": "Falken's Maze",
          "type": "button",
          "value": "maze"
        }, {
          "name": "game",
          "text": "Thermonuclear War",
          "style": "danger",
          "type": "button",
          "value": "war",
          "confirm": {
            "title": "Are you sure?",
            "text": "Wouldn't you prefer a good game of chess?",
            "ok_text": "Yes",
            "dismiss_text": "No"
          }
        }
      ]
    }
  ]
};
rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  // console.log(message);
  // if (message.user === 'U7NPK6TEV') {
  //   return
  // }
  console.log('User %s posted a message in %s channel', rtm.dataStore.getUserById(message.user).name, rtm.dataStore.getChannelGroupOrDMById(message.channel).name);
  rtm.sendMessage('test send', channel)
  // rtm.postMessage('test post', channel)
  axios({
    method: 'post',
    url: 'https://slack.com/api/chat.postMessage',
    body: Object.assign(testMsg, {
      token: bot_token
    }, {channel: channel})
  }).then(a=>{
    console.log("s",a);
  }).catch(err=>{
    console.log('err',err);
  });
});

rtm.start();
