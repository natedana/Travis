const express = require('express');
const router = express.Router();
const axios = require('axios');
const _ = require('underscore');
const delaySeconds = require('./delay').delaySeconds;
const fs = require('fs');
const path = require('path');

const Term = require('./models').Term;
const Exam = require('./models').Exam;

/* const newRes = require('./responseGenerator');// TODO use? */

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/fulfillment', (req, res) => {
  const result = req.body.result;
  let displayText;
  let q1, q2, q3;// TODO can we turn quiz into a repeatable function?

  switch (result.action) {
    case 'save-term.confirm':
      Term.create({ termEN: result.parameters.term })
      .then(() => {
        displayText = `${result.parameters.term} saved to your profile 🔥`;
        res.json({ speech: displayText, displayText });
      })
      .catch(() => {
        displayText = 'You already saved that term!';
        res.json({ speech: displayText, displayText });
      });
      break;
    case 'save-term.reject':
      displayText = 'Term not saved';
      res.json({ speech: displayText, displayText });
      break;
    case 'list':
      Term.find().limit(10).sort({ timeStamp: -1 }).exec((err, results) => {
        if (err) {
          displayText = 'No list pal';
          res.json({ speech: displayText, displayText });
        } else if (results.length === 0) {
          displayText = 'No terms yet - save them with "save"';
          res.json({ speech: displayText, displayText });
        } else {
          displayText = 'Your terms:';
          results.forEach((term, idx) => {
            displayText += `\n ${idx + 1}) ${term.termEN}`;
          });
          res.json({ speech: displayText, displayText });
        }
      }).catch(err => {
        displayText = `Error finding your terms: ${err}`;
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
        displayText = 'Error translating term: ' + err;
        res.json({ speech: displayText, displayText });
      });
      break;
    case 'picture': {
      const queryObj = {
        q: 'q='+result.parameters.term,
        safe: 'safe=medium',
        searchType: 'searchType=image',
        num: 'num=1',
        key: `key=${process.env.GOOGLE_SERVER_KEY}`,
        cx: `cx=${process.env.SEARCH_ID}`,
      };
      let queryUrl = 'https://www.googleapis.com/customsearch/v1?';
      for (var key in queryObj) {
        if (queryObj.hasOwnProperty(key)) {
          queryUrl += queryObj[key] + '&';
        }
      }
      axios.get(queryUrl).then((resp) => {
        const imgUrl = resp.data.items[0].image.thumbnailLink;
        //TODO
        const msg = {"messages": [
          {
            "imageUrl": imgUrl,
            "platform": "slack",
            "type": 3
          },
          {
            "imageUrl": imgUrl,
            "platform": "line",
            "type": 3
          },
          {
            "imageUrl": imgUrl,
            "platform": "twilio",
            "type": 3
          },
          {
            "imageUrl": imgUrl,
            "platform": "facebook",
            "type": 3
          }
        ]};
        res.send(msg);
      }).catch(err => {
          displayText = 'Error finding picture: ' + err;
          res.json({ speech: displayText, displayText });
      });
      break;
    }
		case 'exam': {
      const newExam = new Exam({
        length: parseInt(result.parameters.length) || 2,
        score: 0,
      });
      Term.find().exec((err, Terms) => {
        newExam.questions = _.shuffle(Terms).slice(0,parseInt(result.parameters.length)).map(termObj => ({prompt:termObj.termEN, answer:termObj.termCN}));
        newExam.save(err => {
          if (!err) {
            displayText = `Question 1: Translate ${newExam.questions[0].prompt} to Chinese.`
            res.json({speech: displayText, displayText,
              contextOut: [
                {
                  name: 'quiz-followup',
                  lifespan: 2,
                  parameters: {
                    examData: JSON.stringify(newExam),
                  }
                }
              ]
            });
          }
        });
      });
      break;
    }
    case 'exam-followup':
      if (result.parameters.answer === 'end') {
        displayText = 'Exam cancelled';
        res.json({speech: displayText, displayText});
      }
      else {
        console.log(result.parameters);
        const examData = JSON.parse(result.parameters.examData)
        const id = examData._id;
        Exam.findById(id).exec((err, foundExam => {
          if (foundExam.length === examData.length) {
            displayText = `Finished! You got ${number_correct} out of ${foundExam.length}`;
            res.json({speech: displayText, displayText});
          } else {
						displayText = `Question ${foundExam.currentIndex + 1}: Translate ${foundExam.questions[0].prompt} to Chinese.`;
						foundExam.save(() => {
							res.json({speech: displayText, displayText,
								contextOut: [
									{
										name: 'quiz-followup',
										lifespan: 2,
										parameters: {
											examData: JSON.stringify(newExam),
										}
									}
								]});
						});
            res.json({speech: displayText, displayText: displayText});
          }
        }))
      }
    case 'quiz':
      Term.count().exec((err, count) => {
        var random = Math.floor(Math.random() * count);
        Term.findOne().skip(random).exec((err, term) => {
          if (err) {
            displayText = 'Error creating quiz: ' + err;
            res.json({ speech: displayText, displayText });
          }
          displayText = `What is ${term.termEN} in Chinese?`;
          res.json({
            speech: displayText,
            displayText,
            //TODO contextOut
            contextOut: [
              {
                name: 'quiz-followup',
                lifespan: 2,
                parameters: { term: term.termEN },
              }
            ]
          });
        });
      });
      break;
    case 'quiz.q1'://TODO lexical declaration
      console.log(result)
      const answer = result.contexts[0].parameters.answer;
      const termEN = result.contexts[0].parameters.term;
      let q1res = answer === termEN ? "✔️" : `Ⅹ - ${termEN}`;
      console.log('q1res', q1res, answer, termEN);
      Term.count().exec((err, count) => {
        var random = Math.floor(Math.random() * count);
        Term.findOne().skip(random).exec(function(err, term) {
          displayText = [q1res,`What is ${result.termEN} in Chinese?`].join(' ')
          res.json({speech: displayText, displayText,
            contextOut: [
            {
              name: 'quiz-followup',
              lifespan: 2,
              parameters: { term: term.termEN },
            }
          ]});
        });
      });
      break;
    // case 'quizQ2':
    //   let q2res = (q2.termCN === result.resolvedQuery.trim())?"Correct":`X - ${q2.termCN}`
    //   Term.count().exec(function(err, count) {
    //     var random = Math.floor(Math.random() * count);
    //     Term.findOne().skip(random).exec(function(err, result) {
    //       displayText = `What is the chinese of ${result.termEN}`;
    //       q3 = result
    //       displayText = q2res + '\n' + displayText
    //       res.json({speech: displayText, displayText});
    //     });
    //   });
    //   break;
    // case 'quizQ3':
    //   let q3res = (q3.termCN === result.resolvedQuery.trim())?"Correct":`X - ${q3.termCN}`
    //   displayText = q3res
    //   res.json({speech: displayText, displayText});
    //   break;
    default:
      console.log('default passed');
      res.send('default passed');
      break;
  }
});

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

/* router.post('/list', (req, res) => { */
/*   Term.find({}, (err, results) => { */
/*     if (!results) { */
/*       res.json({success: false, text: "Empty list yoyoyo!"}) */
/*     } else { */
/*       let text = 'Your terms:' */
/*       results.forEach(term => { */
/*         text += `\n   -${term.termEN} / ${term.termCN}` */
/*       }) */
/*       res.json({success: true, text}) */
/*     } */
/*   }).catch(err => { */
/*     res.json({ */
/*       success: false, */
/*       text: `Something went wrong:` + err */
/*     }) */
/*   }) */
/* }); */


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
    if (err) console.log('Error reading file', err);
    else {
      res.send(data);
    }
  });
});

module.exports = router;
