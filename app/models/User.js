const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    providerId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String },
    avatarUrl: { type: String },
    plan: { type: String, enum: ['free', 'premium'], default: 'free' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', UserSchema);
