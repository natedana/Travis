const express = require('express');
const router = express.Router();
const Term = require('./models').Term;

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/new', (req, res) => {
  const newTerm = new Term({
    term: req.body.term
  })
  /* Term.create({ */
  /*   term: req.body.term */
  /* }) */
  newTerm.save()
    .then(resp => {
      console.log('resp', resp);
      res.json({success: true, data: resp});
    })
    .catch(err => {
      res.json({success: false, err, message: 'Error posting to /new'});
    });
})

router.post('/delete', (req, res) => {
  //delte word
})
module.exports = router;
