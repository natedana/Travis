const express = require('express');
const router = express.Router();
const axios = require('axios');
<<<<<<< HEAD
const delaySeconds = require('./delay').delaySeconds;
=======

const Term = require('./models').Term;
>>>>>>> master
const key = process.env.GOOGLE_SERVER_KEY;

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/interactive', (req, res, next) => {
  console.log("PAYLOAD\n\n\n",req.body.payload);
  const parsed = JSON.parse(req.body.payload); //tests vs. real might have diff data structure
  console.log('parsed payload', parsed);
  switch (parsed.callback_id) {
    case('CONFIRM_NEW_TERM'): // we need to check if name of button is save or reject TODO
      console.log('confirm new term selected:');
      delaySeconds(5000,() => {
        console.log('5 second delay');

        // axios.post(SLACK URL FOR MSG POST).send({
        //   MSG text
        // }).then((err,data)=>{
        //   log("DELAY MSG", data)
        // }).catch(err=>{
        //   console.log("BAD DELAYED MSG",err);
        // })
      })
      if (parsed.actions[0].value[0] === '1') {
        Term.create({termEN: parsed.actions[0].value.split('_')[1].slice(3), termCN: parsed.actions[0].value.split('_')[2].slice(3)})
          .then(resp => {
            console.log("word response",resp);
            res.json({success: true, text: `Your term ${resp.termEN} -> ${resp.termCN} saved!🔥`})
          })
          .catch(err => res.json({success: false, text: 'Your term did not save 😔'}));
      } else {
        res.json({success: true, text: 'That\'s ok maybe next time.'})
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
  console.log(req.body.text);
  console.log("BK",Object.keys(req.body));
  console.log("B",req.body);
  axios.post('https://translation.googleapis.com/language/translate/v2?key=' + key, {
    q: [req.body.text],
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
              "value": "1_EN="+req.body.text+"_CN="+termTranslated[0].translatedText
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
    console.log("ERR", err.response.data.error.errors);
  })
});

<<<<<<< HEAD
router.post('/delete', (req, res) => {
  Term.remove({termEN: req.body.text}).exec((err, b) => {
    res.json({success: true, text: `Successfully deleted the term ${req.body.text}.`})
  }).catch(err => {
    res.json({
      success: false,
      text: `Something went wrong:` + err
    })
  })
})

router.post('/list', (req, res) => {
  Term.find({}, (err, results) => {
    if (!results) {
      res.json({success: false, text: "Empty list yoyoyo!"})
    } else {
      let text = 'Your terms:'
      results.forEach(term => {
        text += `\n   -${term.termEN} / ${term.termCN}`
      })
      res.json({success: true, text})
    }
  }).catch(err => {
    res.json({
      success: false,
      text: `Something went wrong:` + err
    })
  })
=======
router.post('/slack/events', (req, res) => {
  const challenge = req.body.challenge;
  console.log('challenge', challenge);
  res.json({ challenge })
>>>>>>> master
})


module.exports = router;
