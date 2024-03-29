const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const userSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  username: String,
  userId: String
});

module.exports = model('User', userSchema);