const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const farmSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  username: String,
  userId: String,
  inventory: {
    potato: {
      type: Number,
      default: 0,
    },
    carrot: {
      type: Number,
      default: 0,
    },
    apple: {
      type: Number,
      default: 0,
    },
    wheat: {
      type: Number,
      default: 0,
    },
  },
  balance: {
    type: Number,
    default: 0,
  },
});

module.exports = model('Farm', farmSchema);