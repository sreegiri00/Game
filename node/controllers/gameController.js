const Game = require("../models/Game");
const User = require("../models/User")

// --- Helper: generate numeric gameId if user doesn't provide one ---
async function generateUniqueGameId() {
  let candidate = Math.floor(Date.now() / 1000); // seconds since epoch
  let exists = await Game.findOne({ gameId: candidate });
  let tries = 0;

  while (exists && tries < 100) {
    candidate += 1;
    exists = await Game.findOne({ gameId: candidate });
    tries++;
  }

  if (exists) throw new Error("Failed to generate unique gameId");
  return candidate;
}


// --- Create a new game ---
async function createGame(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Generate unique gameId
    const gameId = await generateUniqueGameId();
    const gameCode = await generateUniqueGameId();

    // 3️⃣ Create the game
    const game = new Game({
      gameId,
      gameCode,
      users: [user._id],
      password,
    });

    await game.save();

    return res.status(201).json({ message: "Game created successfully", game });
  } catch (err) {
    console.error("createGame error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

// --- Get game by gameId ---
async function getGameByGameId(req, res) {
  try {
    const gameId = parseInt(req.params.gameId);
    if (isNaN(gameId))
      return res.status(400).json({ message: "Invalid gameId" });

    const game = await Game.findOne({ gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    return res.status(200).json({ game });
  } catch (err) {
    console.error("getGameByGameId error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// --- Add a user to a game ---
async function addUserToGame(req, res) {
  try {
    const gameId = parseInt(req.params.gameId);
    const { userId, password } = req.body;

    if (!userId) return res.status(400).json({ message: "userId required" });

    // --- Find user ---
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    // --- Check password ---
    
    // --- Check if user already exists in this game ---
    const gameuser = await Game.findOne({ gameId, users: userId });

    if (gameuser.password !== password) {
    return res.status(400).json({ message: "Incorrect password" });
  }

    if (gameuser) {
      return res.status(400).json({ message: "User already exists in this game" });
    }

    // --- Add user to game ---
    const game = await Game.findOneAndUpdate(
      { gameId },
      { $addToSet: { users: userId } },
      { new: true }
    );

    if (!game) return res.status(404).json({ message: "Game not found" });

    return res.status(200).json({ message: "User added", game });

  } catch (err) {
    console.error("addUserToGame error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}


// --- Remove user from game ---
async function removeUserFromGame(req, res) {
  try {
    const gameId = parseInt(req.params.gameId);
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: "userId required" });

    const game = await Game.findOneAndUpdate(
      { gameId },
      { $pull: { users: userId } },
      { new: true }
    );

    if (!game) return res.status(404).json({ message: "Game not found" });

    return res.status(200).json({ message: "User removed", game });
  } catch (err) {
    console.error("removeUserFromGame error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// --- Record movement or chat (single atomic set) ---
async function recordEvent(req, res) {
  try {
    const gameId = parseInt(req.params.gameId);
    const { userId, movement = null, chat = null } = req.body;

    if (!userId) return res.status(400).json({ message: "userId required" });
    if (!movement && !chat)
      return res
        .status(400)
        .json({ message: "Either movement or chat required" });

    const event = { userId, movement, chat, createdAt: new Date() };

    const game = await Game.findOneAndUpdate(
      { gameId },
      { $push: { events: event }, $addToSet: { users: userId } },
      { new: true }
    );

    if (!game) return res.status(404).json({ message: "Game not found" });

    return res.status(200).json({ message: "Event recorded", event, game });
  } catch (err) {
    console.error("recordEvent error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// --- Get all events (with optional limit & since) ---
async function getEvents(req, res) {
  try {
    const gameId = parseInt(req.params.gameId);
    const limit = parseInt(req.query.limit || "100");
    const since = req.query.since ? new Date(req.query.since) : null;

    const game = await Game.findOne({ gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    let events = game.events || [];

    if (since && !isNaN(since.getTime())) {
      events = events.filter((e) => new Date(e.createdAt) > since);
    }

    events = events.slice(-limit);

    return res.status(200).json({ events });
  } catch (err) {
    console.error("getEvents error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// --- End a game ---
async function endGame(req, res) {
  try {
    const gameId = parseInt(req.params.gameId);

    const game = await Game.findOneAndUpdate(
      { gameId },
      { $set: { endedAt: new Date() } },
      { new: true }
    );

    if (!game) return res.status(404).json({ message: "Game not found" });

    return res.status(200).json({ message: "Game ended", game });
  } catch (err) {
    console.error("endGame error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createGame,
  getGameByGameId,
  addUserToGame,
  removeUserFromGame,
  recordEvent,
  getEvents,
  endGame,
};
