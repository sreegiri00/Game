import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const GameSelector = () => {
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedGameOption] = useState(["Bingo", "Snake"]);
  const [showModal, setShowModal] = useState(false);
  const [gameId, setGameId] = useState("");
  const [gamePass, setGamePass] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isCreating, setIsCreating] = useState(false); // 🔹 to track whether creating or finding

  const navigate = useNavigate();
  const userName = useSelector((state) => state.auth.userName);
  const userPas = useSelector((state) => state.auth.userPas);

  // --- Toast Message ---
  const showMessage = (msg, type = "success") => {
    setShowToast({ msg, type });
    setTimeout(() => setShowToast(null), 2000);
  };

  // --- Open Modal for Create ---
  const handleCreate = (e) => {
    e.preventDefault();
    if (!selectedGame) {
      return showMessage("⚠️ Please select a game!", "error");
    }
    setIsCreating(true); // create mode
    setShowModal(true); // open modal
    setError("");
    setMessage("");
    setGamePass("");
  };

  // --- Open Modal for Find ---
  const handleFind = (e) => {
    e.preventDefault();
    if (!selectedGame) {
      return showMessage("⚠️ Select a game first!", "error");
    }
    setIsCreating(false); // find mode
    setShowModal(true);
    setError("");
    setMessage("");
    setGameId("");
    setGamePass("");
  };

  // --- Submit from Modal ---
  const handleSubmit = async () => {
    if (!gamePass.trim()) {
      showMessage("⚠️ Please enter a password!", "error");
      return;
    }

    setShowModal(false);
    setLoading(true);

    try {
      if (isCreating) {
        // ✅ Create game
        showMessage(`🎮 Creating new ${selectedGame} game...`, "success");

        const response = await axios.post("http://localhost:5001/api/game/games", {
          email: userName,
          password: gamePass,
        });

        if (response.data) {
          localStorage.setItem("gametoken", response.data.gametoken);
          setMessage("✅ Game created successfully!");
          navigate("/bingo");
        } else {
          setError(response.data.message || "Unable to create game!");
        }
      } else {
        // ✅ Join existing game
        if (!gameId.trim()) {
          showMessage("❌ Please enter a valid Game ID!", "error");
          return;
        }

        showMessage(`🔍 Searching for ${selectedGame} with ID: ${gameId}`, "success");

        const response = await axios.post(`http://localhost:5001/api/game/games/${gameId}/users`, {
          email: userName,
          password: gamePass,
        });

        if (response.data?.game) {
          const gameData = response.data.game;
          localStorage.setItem("gameData", JSON.stringify(gameData));
          setMessage("🎯 Game joined successfully!");
          navigate("/bingo");
        } else {
          setError("⚠️ Game not found!");
          showMessage("⚠️ Game not found!", "error");
        }
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      const msg = err.response?.data?.message || "🚫 Server error!";
      setError(msg);
      showMessage(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-white bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_40%)] blur-3xl"></div>

      <h1 className="z-10 mb-10 text-5xl font-extrabold tracking-wide drop-shadow-lg">
        🎮 Game Zone
      </h1>

      {/* Card */}
      <div className="z-10 flex flex-col items-center gap-6 p-8 rounded-3xl bg-white/20 backdrop-blur-xl shadow-2xl w-[22rem] border border-white/30">
        <label className="text-xl font-semibold tracking-wide">
          Select Your Game
        </label>

        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="w-full p-3 font-medium text-center text-gray-800 bg-white shadow-inner rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="">Select a Game</option>
          {selectedGameOption.map((res, index) => (
            <option key={index} value={res.toLowerCase()}>
              {res}
            </option>
          ))}
        </select>

        <div className="flex justify-center w-full gap-6 mt-6">
          <button
            disabled={loading}
            onClick={handleCreate}
            className={`flex-1 px-4 py-2 font-semibold text-white rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 hover:shadow-xl transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            onClick={handleFind}
            className="flex-1 px-4 py-2 font-semibold text-white transition duration-200 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-105 hover:shadow-xl"
          >
            Find ID
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="relative p-8 text-center transition-transform scale-105 bg-white shadow-2xl rounded-3xl w-96">
            <button
              onClick={() => setShowModal(false)}
              className="absolute text-gray-400 top-3 right-3 hover:text-gray-700"
            >
              ✖
            </button>

            <h2 className="mb-5 text-2xl font-bold text-gray-800">
              {isCreating ? "Create Game" : "Join Game"}
            </h2>

            {!isCreating && (
              <input
                type="text"
                placeholder="Enter Game ID..."
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full p-3 mb-5 text-center text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            )}

            <input
              type={show ? "text" : "password"}
              placeholder="Enter Game Password..."
              value={gamePass}
              onChange={(e) => setGamePass(e.target.value)}
              className="w-full p-3 mb-5 text-center text-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <button
              onClick={() => setShow(!show)}
              className="mb-4 text-sm font-medium text-purple-600 hover:underline"
            >
              {show ? "Hide Password" : "Show Password"}
            </button>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleSubmit}
                className="px-5 py-2 font-semibold text-white transition-transform duration-200 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl hover:scale-105 hover:shadow-lg"
              >
                ✅ Submit
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 font-semibold text-gray-800 transition-transform duration-200 bg-gray-200 rounded-xl hover:bg-gray-300 hover:scale-105"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white font-medium shadow-lg animate-fade-in ${showToast.type === "error"
            ? "bg-red-500/90"
            : "bg-green-500/90"
            }`}
        >
          {showToast.msg}
        </div>
      )}
    </div>
  );
};

export default GameSelector;
