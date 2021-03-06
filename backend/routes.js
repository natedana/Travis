const express = require('express');
const router = express.Router();
const axios = require('axios');
const _ = require('underscore');
const fs = require('fs');
const path = require('path');

const Term = require('./models').Term;
const Exam = require('./models').Exam;

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/fulfillment', (req, res) => {
  const result = req.body.result;
  console.log('\n\nDialogFlow result:\n', result);
  let displayText;

  switch (result.action) {
    case 'save-term.confirm':
      Term.create({ termEN: result.parameters.term , termCN: result.parameters.term })
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
		case 'exam-start': {
      Term.find().exec((err, foundTerms) => {
        const newExam = new Exam({
          examLength: result.parameters.number || foundTerms.length || 1,
        });
        newExam.questions =
          _.shuffle(foundTerms)
           .slice(0, newExam.examLength)
           .map(termObj => ({
             prompt: termObj.termEN,
             answer: termObj.termCN
           }));
        newExam.save(err => {
          if (!err) {
            displayText = `Q1) Translate ${newExam.questions[0].prompt} to Chinese (1/${newExam.examLength})`;
            res.json({
              speech: displayText,
              displayText,
              contextOut: [
                {
                  name: 'exam-followup',
                  lifespan: 1,
                  parameters: {
                    examData: newExam,
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
      const examData = Object.assign({}, result.contexts[0].parameters.examData);
      // console.log('\ncurrent', result.parameters.answer, examData.currentIndex, examData.questions[examData.currentIndex].answer);
      if (examData.questions[examData.currentIndex].answer.toLowerCase() === result.parameters.answer.toLowerCase()) {
        examData.score += 1;
      }
      if (examData.currentIndex + 1 === examData.examLength) {
        displayText = `Finished! You got ${examData.score} out of ${examData.examLength}`;
        res.json({ speech: displayText, displayText });
      } else {
        examData.currentIndex += 1;
				displayText = `Q${examData.currentIndex + 1}: Translate ${examData.questions[examData.currentIndex].prompt} to Chinese (${examData.currentIndex + 1}/${examData.examLength})`;
				res.json({
          speech: displayText,
          displayText,
					contextOut: [
						{
							name: 'exam-followup',
							lifespan: 2,
							parameters: {
								examData: examData,
							}
						}
					]
        });
      }
      break;
    default:
      res.send('default passed');
      break;
  }
});

router.get('/privacy_policy', (req, res) => {
  fs.readFile(path.join('./public/privacy_policy.html'), 'utf8', (err, data) => {
    if (err) console.log('Error reading file', err);
    else {
      res.send(data);
    }
  });
});


module.exports = router;
