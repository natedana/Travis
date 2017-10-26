const express = require('express');
const router = express.Router();
const axios = require('axios');
const delaySeconds = require('./delay').delaySeconds;
const fs = require('fs');

const Term = require('./models').Term;
const key = process.env.GOOGLE_SERVER_KEY;

const newRes = require('./responseGenerator');

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/fulfillment', (req, res, next) => {
  console.log('\n/fulfillment', req.body);
  const result = req.body.result;
  let displayText;

  switch (result.action) {
    case 'save-term.confirm':
      Term.create({ termEN: result.parameters.term })
        .then(resp => {
          console.log('\nterm created', resp);
          displayText = `${result.parameters.term} saved to your profile 🔥`;
          res.json({ speech: displayText, displayText });
        })
        .catch(err => {
          console.log('\nError: term not created', err);
          displayText = `Uh oh, something went wrong.`;
          res.json({ speech: displayText, displayText });
        });
        break;
      case 'save-term.reject':
        displayText = 'Term not saved'
        res.json({ speech: displayText, displayText });
        break;
      case 'request-list':
       Term.find().limit(10).exec((err, results) => {
         if (!results) {
           res.json(newRes('No List Pal'))
         } else {
           let text = 'Your terms:'
           results.forEach(term => {
             text += `\n-${term.termEN}`
           })
           console.log('\nYour terms', text);
           res.json(newRes(text))
         }
       }).catch(err => {
         res.json(newRes("Error:" + err))
       });
       break;
    //  case 'delete-term.confirm':
    //    Term.remove({termEN: result.parameters.term}).exec((err, b) => {
    //      res.json(newRes('Term '+result.parameters.term+' deleted.'))
    //    }).catch(err => {
    //      res.json(newRes('Term doesn\'t exist.'+err))
    //    });
    //    break;
    default:
      console.log('default passed');
      res.send('default passed');
      break;
  }
})

router.post('/interactive', (req, res, next) => {
  console.log("PAYLOAD\n\n\n",req.body.payload);
  const parsed = JSON.parse(req.body.payload); //tests vs. real might have diff data structure
  console.log('parsed payload', parsed);
  switch (parsed.callback_id) {
    case('CONFIRM_NEW_TERM'): // we need to check if name of button is save or reject TODO
      console.log('confirm new term selected:');
      delaySeconds(5000,() => {
        console.log('5 second delay');
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
});

router.get('/privacy_policy', (req, res) => {
  fs.readFile('./privacy_policy.html', 'utf8', (err, data) => {
    console.log(data);
    res.send(data);
  });
})

module.exports = router;
