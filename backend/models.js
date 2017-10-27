const mongoose = require('mongoose');

const TermSchema = new mongoose.Schema({
  termEN: {
    type: String,
    unique: true,
  },
  termCN: {
    type: String,
  },
  timeStamp: {
    type: Date,
    default: new Date(),
  }
});

const ExamSchema = new mongoose.Schema({
  length: {
    type: Number,
  },
  questions: [{
    prompt : String,
    answer : String
     }],
  score: {
    type: Number,
  },
});

const Term = mongoose.model('Term', TermSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {
  Term,
  User,
};
