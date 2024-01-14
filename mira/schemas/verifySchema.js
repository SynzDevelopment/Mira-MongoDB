const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const verifySchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  code: String,
  id: String
});

module.exports = model('Verify', verifySchema);