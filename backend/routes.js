const express = require('express');
const router = express.Router();
const Term = require('./models').Term;

router.get('/', (req, res) => {
  res.send('hello world');
});
router.post('/new', (req,res) => {
  //add word
})
router.post('/delete', (req,res) => {
  //delte word
})
module.exports = router;
