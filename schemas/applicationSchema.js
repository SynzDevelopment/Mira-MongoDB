const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const applicationSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  userName: String,
  userId: String,
  responses: [{
    type: String,
    required: true,
  }],
});

module.exports = model('Application', applicationSchema);