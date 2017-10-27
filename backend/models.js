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
  questions: {
    type: Array,// questions: [{prompt, answer}]
  },
  examLength: {
    type: Number,
    default: 3,
  },
  score: {
    type: Number,
    default: 0,
  },
  currentIndex: {
    type: Number,
    default: 0,
  }
});

const Term = mongoose.model('Term', TermSchema);
const Exam = mongoose.model('Exam', ExamSchema);

module.exports = {
  Term,
  Exam,
};
