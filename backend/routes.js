const express = require('express');
const router = express.Router();
const axios = require('axios');
const delaySeconds = require('./delay').delaySeconds;
const fs = require('fs');
const path = require('path');

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
      const queryObj = {
        q: 'q='+result.parameters.term,
        safe: 'safe=medium',
        searchType: 'searchType=image',
        num: 'num=1',
        key: `key=${process.env.GOOGLE_SERVER_KEY}`,
        cx: `cx=${process.env.SEARCH_ID}`,
      }
      let url = 'https://www.googleapis.com/customsearch/v1?';
      for (var key in queryObj) {
        url += queryObj[key] + '&';
      }
      console.log('url', url);
      axios.get(url).then((resp) => {
        const IMurl = resp.data.items[0].image.thumbnailLink;
        const msg = {"messages": [
          {
            "imageUrl": IMurl,
            "platform": "slack",
            "type": 3
          },
          {
            "imageUrl": IMurl,
            "platform": "facebook",
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


// router.get('/facebook_redirect', (req, res) => {
//   const FB_APP_ID = '362280927530951';
//   const REDIRECT_FB_URL = 'http://localhost:3000/facebook_redirect';
//   const fbUrl = `https://www.facebook.com/v2.10/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${REDIRECT_FB_URL}`;
//   let fbGraphUrl = 'https://graph.facebook.com/v2.10/oauth/access_token?';
//   const fbObj = {
//     client_id: FB_APP_ID,
//     redirect_uri: REDIRECT_FB_URL,
//     client_secret: process.env.FB_CLIENT_SECRET,
//     code: req.query.code,
//   }
//   for (var key in fbObj) {
//     fbGraphUrl += fbObj[key] + '&'
//   }
//   axios.get(fbGraphUrl)
//     .then((resp) => {
//       console.log(resp);
//       res.send('Authenticated with Facebook!');
//     })
//     .catch((err) => {
//       console.log(err);
//       res.send('Error authenticating login');
//     })
// })
// router.get('/facebook_redirect', (req, res) => {
//   fs.readFile(path.join('./public/facebook_redirect.html'), 'utf8', (err, data) => {
//     res.send(data);
//   });
// })

router.get('/privacy_policy', (req, res) => {
  fs.readFile(path.join('./public/privacy_policy.html'), 'utf8', (err, data) => {
    res.send(data);
  });
})

module.exports = router;
