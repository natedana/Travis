const express = require('express');
const router = express.Router();

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;


var bot_token = process.env.SLACK_BOT_TOKEN || '';
var rtm = new RtmClient(bot_token);
let channel = '' // OUR PRIVATE MESSAGE

/* rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => { */
/*   console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, and connected to private message.`); */
/* }); */

// you need to wait for the client to fully connect before you can send messages
//sends message on successful connect
/* rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function() { */
  // console.log(channel);
/* }); */

/* rtm.on('message', function(data) { */
/*   // console.log('data:',data); */
/*   apiaiRequest(data.text,data.ts) */
/*     .then(response=>{ */
/*       console.log('Dialog response',response); */
/*       // rtm.sendMessage(response.result.fulfillment.speech,channel); */
/*       date = response.result.parameters.date; */
/*       subject = response.result.parameters.subject; */
/*       event = { */
/*         start: {date}, */
/*         end: {date}, */
/*         summary: subject, */
/*       }; */
/*       var googleOauth = 'http://localhost:3000/google/oauth' */
/*       rtm.sendMessage('Authenticate: ' + googleOauth, channel); */
/*     }) */
/*     .catch(err=>{ */
/*       console.log('DF err',err); */
/*     }) */
/* }) */

rtm.start();
