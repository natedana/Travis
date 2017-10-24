const express = require('express');
const router = express.Router();
const Term = require('./models').Term;

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/interactive', (req, res, next) => {
    const parsed = JSON.parse(req.body.payload)
    const callback_id = parsed.callback_id;
    switch (callback_id) {
      case ('CONFIRM_NEW_TERM'): // we need to check if name of button is save or reject TODO
        Term.create({
          term: parsed.actions[0].value,
        })
        .then(resp => res.json({ text: `Your term ${resp.term} saved!🔥` }))
        .catch(err => res.json({ text: 'Your term did not save 😔' }) );
      default:
        res.json({ text: 'Hmm, something went wrong with your interactive' });
    }
})

router.post('/new/confirm', (req, res) => {
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
            "value": `${req.body.text}`
          },
          {
            "name": "reject",
            "text": "Reject",
            "type": "button",
            "value": "reject"
          },
        ]
      }
    ]
  }
  res.json(confirmMsg);
});



router.post('/delete', (req,res) => {
  //delte word
})
module.exports = router;
