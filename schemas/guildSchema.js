const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const guildSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  guildName: String,
  guildId: String,
  ownerId: String,
  channels: [
    {
      channel: String,
      channelId: String,
    }
  ],
  roles: [
    {
      role: String,
      roleId: String,
    }
  ],
  verification: {
    type: Boolean,
    default: false,
  },
  verified_role: String,
  unverified_role: String,
  verification_channel: String,
  channel_redirect: String
});

module.exports = model('Guild', guildSchema);