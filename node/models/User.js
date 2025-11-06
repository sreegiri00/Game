const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: String },
  firstName: { type: String, trim: true, maxlength: 50 },
  lastName: { type: String, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  phone: { type: String, trim: true },
  role: { type: String, enum: ['superadmin', 'admin', 'vendor', 'user'], default: 'user' },
  otp: String,
  otpExpire: Date,
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  gameId: { type: Number, default: 0 },
  parover: { type: Boolean, default: false },
  friId: { type: [String], default: [] },
  lastLogin: Date,
  refreshToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  deleteAt: { type: Date, default: null } // 👈 new field
}, { timestamps: true });

// Automatically schedule unverified users for deletion in 3 minutes
UserSchema.pre('save', function (next) {
  if (!this.isVerified && !this.deleteAt) {
    this.deleteAt = new Date(Date.now() + 3 * 60 * 1000);
  }
  next();
});

// TTL index — MongoDB will auto-delete when deleteAt time passes
UserSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0 });

// ✅ Export model
module.exports = mongoose.model('User', UserSchema);
