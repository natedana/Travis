const express = require('express');
const router = express.Router();
const Term = require('./models').Term;
const axios = require('axios');
const key = process.env.GOOGLE_SERVER_KEY;
router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/interactive', (req, res, next) => {
  const parsed = JSON.parse(req.body.payload); //tests vs. real might have diff data structure
  console.log('parsed payload', parsed);
  switch (parsed.callback_id) {
    case('CONFIRM_NEW_TERM'): // we need to check if name of button is save or reject TODO
      console.log('confirm new term selected:');
      console.log(parsed.actions);
      if (parsed.actions[0].value[0] === '1') {
        Term.create({termEN: parsed.actions[0].value.split('_')[1].slice(3), termCN: parsed.actions[0].value.split('_')[2].slice(3)})
          .then(resp => res.json({success: true, text: `Your term ${resp.term} saved!🔥`}))
          .catch(err => res.json({success: false, text: 'Your term did not save 😔'}));
      } else {
        res.json({success: false, text: 'That\'s ok maybe next time.'})
      }
      break;
    default:
      console.log('default passed \n \n Parsed payload');
      console.log(parsed);
      res.json({success: false, text: 'Hmm, something went wrong with your interactive'});
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
              "value": "1_EN="+req.body.text"_CN="+termTranslated[0].translatedText
            }, {
              "name": "reject",
              "text": "Reject",
              "type": "button",
              "value": "0"
            }
          ]
        }
      ]
    }
    res.status(200).json(confirmMsg);
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
