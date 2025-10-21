const mongoose = require('mongoose');

// --- Game Schema ---
const GameSchema = new mongoose.Schema({
  gameId: { type: Number, required: true, unique: true, index: true },
  users: [{ type: mongoose.Schema.Types.Mixed }], 
  password: { type: String, required: true },
  gameCode: { type: Number, required: true, unique: true, index: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60, 
  },
  moves: {
    type: [Number], 
    default: [],    
  },
  endedAt: { type: Date, default: null },
});

module.exports = mongoose.model('Game', GameSchema);
