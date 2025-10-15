import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // ✅ import client

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ check session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) navigate("/game");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">
            🎱 Bingo Game
          </h1>
          <p className="text-xl text-white/90">
            Test your luck and mark your way to victory!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-white">How to Play</h2>
          <ul className="text-white/90 space-y-2 text-left">
            <li>✓ Get a random bingo board</li>
            <li>✓ Numbers are called automatically</li>
            <li>✓ Mark the numbers on your board</li>
            <li>✓ Complete a row, column, or diagonal to win!</li>
          </ul>
        </div>

        <button
          onClick={() => navigate("/auth")}
          className="bg-white text-primary hover:bg-white/90 text-xl px-8 py-6 rounded-lg font-semibold"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
