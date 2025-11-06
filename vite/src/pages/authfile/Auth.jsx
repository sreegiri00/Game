import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { change_userName, change_userPas } from "../../Redux/authRedux/authSlice";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userName = useSelector((state) => state.auth.userName);
  const userPas = useSelector((state) => state.auth.userPas);

  const changeName = (e) => {
    dispatch(change_userName(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
   

    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", {
        email: userName,
        password: userPas,
      });

      // ✅ Check success


      if (response.data.message) {
        setMessage(response.data.message || "Login successful..!");
        localStorage.setItem("token", response.data.token);
        navigate("/game");

      } else {
        setError(response.data.message || "Invalid credentials");
      }

    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password");
      } else if (err.response) {
        setError(err.response.data.message || "Server error occurred!");
      } else {
        setError("Unable to connect to the server!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="w-full max-w-md p-8 text-center bg-white/10 backdrop-blur-md rounded-2xl">
        <h1 className="mb-6 text-3xl font-bold text-white">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 text-gray-800 rounded-md outline-none bg-white/80"
            value={userName}
            onChange={changeName}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 text-gray-800 rounded-md outline-none bg-white/80"
            value={userPas}
            onChange={(e) => dispatch(change_userPas(e.target.value))}
            required
          />

          {error && <p className="text-red-200">{error}</p>}
          {message && <p className="text-green-200">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-indigo-600 transition bg-white rounded-md hover:bg-gray-100"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-white/80">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="font-semibold text-yellow-300 underline"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
