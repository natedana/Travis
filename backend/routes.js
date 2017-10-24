const express = require('express');
const router = express.Router();
const Term = require('./models').Term;

router.get('/', (req, res) => {
  res.send('hello world');
});

// router.use('/interactive', (req, res, next) => {
//   const callback_id = JSON.parse(req.payload).callback_id;
//   if (callback_id === "CONFIRM_NEW_TERM") {
//     next();
//   }
// })

router.post('/interactive', (req, res, next) => {
    const parsed = JSON.parse(req.body.payload)
    const callback_id = parsed.callback_id;
    if (callback_id === "CONFIRM_NEW_TERM") {
      Term.create({
        term: parsed.actions[0].value,
      })
        .then(resp => {
          res.json({success: true, data: resp});
        })
        .catch(err => {
          res.json({success: false, err, message: 'Error posting to /new'});
        });
    } else {
      res.json({success: false})
    }
})

// router.post('/new', (req, res) => {
//   console.log('reqbody', req.body.text, 'reqbod', req.body);
//   res.json({success: true})
//   Term.create({
//     term: req.body.text
//   })
//     .then(resp => {
//       /* console.log('resp', resp); */
//       res.json({success: true, data: resp});
//     })
//     .catch(err => {
//       res.json({success: false, err, message: 'Error posting to /new'});
//     });
// })

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
