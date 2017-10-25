const express = require('express');
const router = express.Router();
const Term = require('./models').Term;
const axios = require('axios');
const key = process.env.GOOGLE_SERVER_KEY;
router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/interactive', (req, res, next) => {
  const parsed = JSON.parse(req.body.payload);
  const callback_id = parsed.callback_id;
  switch (callback_id) {
    case('CONFIRM_NEW_TERM'): // we need to check if name of button is save or reject TODO
      Term.create({termEN: parsed.actions[0].value.en, termCN: parsed.actions[0].value.cn}).then(resp => res.json({text: `Your term ${resp.term} saved!🔥`})).catch(err => res.json({text: 'Your term did not save 😔'}));
    default:
      res.json({text: 'Hmm, something went wrong with your interactive'});
  }
})

router.post('/new/confirm', (req, res) => {
  const languageOpts = ['en', 'zh-CN'];
  axios.post('https://translation.googleapis.com/language/translate/v2?key=' + key, {
    q: ['truck'],
    target: 'zh-CN',
    format: 'text',
    source: 'en'
  }).then(result => {
    const termTranslated = result.data.data.translations;
    const confirmMsg = {
      "text": `Would you like to save the word ${req.body.text}?`,
      "attachments": [
        {
          "text": "Save or reject",
          "fallback": "You are unable to confirm this word.",
          "callback_id": "CONFIRM_NEW_TERM",
          "color": "#3AA3E3",
          "attachment_type": "default",
          "actions": [
            {
              "name": "save",
              "text": "Save",
              "type": "button",
              "value": {
                en: `${req.body.text}`,
                cn: termTranslated[0].translatedText
              },
            }, {
              "name": "reject",
              "text": "Reject",
              "type": "button",
              "value": "reject"
            }
          ]
        }
      ]
    }
    res.json(confirmMsg);
  }).catch(err => {
    console.log("ERR", err.response.status);
    console.log("ERR", err.response.data);
    console.log("ERR", err.response.data.error.errors);
  })
});

router.post('/delete', (req, res) => {
  //delte word
})
module.exports = router;
