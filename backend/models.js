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
  },
  // owner: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User' }
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});

const Term = mongoose.model('Term', TermSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {
  Term,
  User,
};
