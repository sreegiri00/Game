import { useEffect, useState } from "react";


const Bingo = () => {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState([]);

  // 🔹 Generate a 5x5 Bingo grid (numbers 1–25)
  useEffect(() => {
    const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    setGrid(numbers);
  }, []);
  

  
  // 🔹 Handle cell click
  const handleClick = (num) => {
    if (!selected.includes(num)) {
      setSelected([...selected, num]);
    }
  };

  // 🔹 Reset game
  const resetGame = () => {
    setSelected([]);
    const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    setGrid(numbers);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <h1 className="mb-6 text-4xl font-bold text-white drop-shadow-lg">
        🎱 Bingo Game
      </h1>

      {/* Bingo Grid */}
      <div className="grid grid-cols-5 gap-3">
        {grid.map((num) => (
          <button
            key={num}
            onClick={() => handleClick(num)}
            className={`w-16 h-16 flex items-center justify-center text-lg font-semibold rounded-xl transition-all
              ${selected.includes(num)
                ? "bg-green-400 text-white scale-110 shadow-lg"
                : "bg-white/80 text-gray-800 hover:bg-yellow-200"
              }`}
          >
            {num}
          </button>
        ))}
      </div>
      {selected[0] ? "" :
        <button
          onClick={resetGame}
          className="px-6 py-3 mt-8 font-bold text-indigo-700 transition rounded-lg bg-white/90 hover:bg-white"
        >
          🔁 Reset Game
        </button>
      }
    </div>
  );
};

export default Bingo;
