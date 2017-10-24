const mongoose = require('mongoose');

const TermSchema = new mongoose.Schema({
  en: {
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
