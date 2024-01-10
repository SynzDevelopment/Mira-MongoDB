// schemas/userSchema.js
const mongoose = require('mongoose');

const connectDB = require('../db.js');

// Call connectDB before using the model
connectDB();

const userSchema = new mongoose.Schema({
  user_id: String,
  verification_code: String,
});

// Method to check if a user ID exists in the collection
userSchema.statics.userExists = async function (userId) {
  const user = await this.findOne({ user_id: userId });
  return !!user;
};

// Method to update the verification code for an existing user
userSchema.statics.updateVerificationCode = async function (userId, newVerificationCode) {
  await this.updateOne({ user_id: userId }, { verification_code: newVerificationCode });
};

const UserData = mongoose.model('UserData', userSchema);

module.exports = UserData;