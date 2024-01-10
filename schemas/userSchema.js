const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: String,
  id: String
});

module.exports = model('User', userSchema);