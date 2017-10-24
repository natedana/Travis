const express = require('express');
const router = express.Router();
const Term = require('./models').Term;

router.get('/', (req, res) => {
  res.send('hello world');
});
<<<<<<< HEAD
router.post('/new', (req,res) => {
  //add word
=======

router.post('/new', (req, res) => {
  Term.create({
    term: req.body.term
  })
    .then(resp => {
      console.log('resp', resp);
      res.json({success: true, data: resp});
    })
    .catch(err => {
      res.json({success: false, err, message: 'Error posting to /new'});
    });
>>>>>>> 1675edae7e891de4d8ae07121c966cee5a4f905a
})
router.post('/delete', (req,res) => {
  //delte word
})
module.exports = router;
