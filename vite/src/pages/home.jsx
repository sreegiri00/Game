import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // ✅ import client
import "../css/Home.css"

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
    <div className="game-container">
      <div className="content">
        {/* --- Heading --- */}
        <div className="heading-section">
          <h1>🎮 Let’s Start the Game!</h1>
          <p>Step into the world of online Bingo — where fun meets competition!</p>
        </div>

        {/* --- Online Gameplay --- */}
        <div className="card">
          <h2>Online Gameplay</h2>
          <p>
            Play with friends or challenge random players in real-time. Each player
            gets a unique board, and numbers are called live for everyone.
            Stay sharp, mark your numbers fast, and be the first to shout <b>BINGO!</b>
          </p>
        </div>

        {/* --- How to Play --- */}
        <div className="card">
          <h2>How to Play</h2>
          <ul>
            <li>✓ Get a random bingo board</li>
            <li>✓ Numbers are called automatically</li>
            <li>✓ Mark the numbers on your board</li>
            <li>✓ Complete a row, column, or diagonal to win!</li>
          </ul>
        </div>

        {/* --- Button --- */}
        <button onClick={() => navigate("/auth")} className="start-btn">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
