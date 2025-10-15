const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const GameSchema = new mongoose.Schema({
  userIds: { type: [String], required: true }, 
  boxData: { type: [Number], default: [] }, 
  place: { type: [[Number]], default: [] }, // Array of arrays (nested numbers)
  chat: [
    {
      senderId: { type: String, required: true },     // ID of the person who sent the message
      msg: { type: String, required: true, trim: true } // Message content
    }
  ],
  password: { type: String, required: true }, // Game password (will be hashed)
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

// Hash password before saving
GameSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare entered password with stored hashed password
GameSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Hide sensitive data when sending response
GameSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("Game", GameSchema);
