const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  id: String
});

module.exports = model('User', userSchema);