const express = require('express');
const router = express.Router();
const axios = require('axios');
const delaySeconds = require('./delay').delaySeconds;
const fs = require('fs');

const Term = require('./models').Term;

const newRes = require('./responseGenerator');

// when we do `res.json({ speech, displayText })`, we are using "Fulfillment Response" (https://dialogflow.com/docs/fulfillment#response)

// however, we can also send very simple DialogFlow "default messages" using the formats at this URL:   https://dialogflow.com/docs/reference/agent/message-objects#one-click_integration_message_objects
//  res.send({"messages": [
//    {
//      "speech": "Text response",
//      "type": 0
//    }
//  ]});


router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/fulfillment', (req, res, next) => {
  const result = req.body.result;
  let displayText;

  switch (result.action) {
    case 'save-term.confirm':
      Term.create({ termEN: result.parameters.term })
      .then(resp => {
        displayText = `${result.parameters.term} saved to your profile 🔥`;
        res.json({ speech: displayText, displayText });
      })
      .catch(err => {
        displayText = `You already saved that term!`;
        res.json({ speech: displayText, displayText });
      });
      break;
    case 'save-term.reject':
      displayText = 'Term not saved'
      res.json({ speech: displayText, displayText });
      break;
    case 'list':
      Term.find().limit(10).sort({ timeStamp: -1 }).exec((err, results) => {
        if (!results) {
          displayText = 'No list pal';
          res.json({ speech: displayText, displayText });
        } else {
          displayText = 'Your terms:';
          results.forEach((term, idx) => {
            displayText += `\n ${idx + 1}) ${term.termEN}`;
          });
          res.json({ speech: displayText, displayText });
        }
      }).catch(err => {
        displayText = `Error: ${err}`;
        res.json({ speech: displayText, displayText });
      });
      break;
    case 'translate':
      axios.post('https://translation.googleapis.com/language/translate/v2?key=' + process.env.GOOGLE_SERVER_KEY, {
        q: result.parameters.term,
        target: 'zh-CN',
        source: 'en',
        format: 'text'
      }).then((resp) => {
        displayText = `${result.parameters.term} ~ ${resp.data.data.translations[0].translatedText}`;
        res.json({ speech: displayText, displayText });
      }).catch(err => {
        displayText = 'Error: ' + err;
        res.json({ speech: displayText, displayText });
      });
      break;
    case 'picture':
      var q = 'q='+result.parameters.term;
      var safe = 'safe=medium';
      var searchType = 'searchType=image';
      var num = 'num=1';
      var key = `key=${process.env.GOOGLE_SERVER_KEY}`;
      var cx = `cx=${process.env.SEARCH_ID}`;
      var params = [q, safe, searchType, num, key, cx];
      var url = 'https://www.googleapis.com/customsearch/v1?' + params.join('&');
      console.log('\ndebug:', result);
      axios.get(url).then((resp) => {
        const IMtitle = resp.data.items[0].title;
        const IMurl = resp.data.items[0].image.thumbnailLink;
        console.log('imurl', IMurl);
        const msg = {"messages": [
          {
            "imageUrl": IMurl,
            "platform": "slack",
            "type": 3
          }
        ]};
        res.send(msg);
      }).catch(err => {
       console.log("ERR", err.response.data.error);
      })
      break;
    default:
      console.log('default passed');
      res.send('default passed');
      break;
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
