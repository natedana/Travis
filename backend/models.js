const mongoose = require('mongoose');

const TermSchema = new mongoose.Schema({
  term: {
    type: String,
  },
  timeStamp: {
    type: Date,
    default: new Date(),
  },
});

const Term = mongoose.model('Term', TermSchema);

module.exports = {
  Term,
};
