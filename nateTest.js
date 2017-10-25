const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Term = require('./backend/models').Term;
const startTimer = require('./backend/eventGenerator').startTimer;

const app = express();

mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.send('hello world');
});

app.post('/delete', (req, res) => {
  Term.remove({termEN: req.body.text}).exec((err, b) => {
    console.log(b.message.documents);
    res.json({success: true, text: `Successfully deleted the term ${req.body.text}.`})
  }).catch(err => {
    res.json({
      success: false,
      text: `Something went wrong:` + err
    })
  })
})

app.post('/list', (req, res) => {
  console.log("LIST called");
  Term.find().exec( (err, results) => {
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
})

app.post('/interactive', (req, res, next) => {
  Term.create({
    termEN: req.body.en,
    termCN: req.body.cn
  }).then(resp => {
    console.log("Start");
    startTimer(5000,() => {
      console.log('5 second delay')
    })
    // console.log("word response", resp);
    res.json({success: true, text: `Your term ${resp.termEN} -> ${resp.termCN} saved!🔥`})
  }).catch(err => res.json({success: false, text: 'Your term did not save 😔'}));
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('listening on', port);
});

module.exports = app;
