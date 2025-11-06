import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { change_userName } from "../../Redux/authRedux/authSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const refval = useRef("");

  const changeName = (e) => {
    setUserName(e.target.value);
    dispatch(change_userName(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    // Clear any existing tokens
    localStorage.removeItem("token");
    localStorage.removeItem("gameData");
    localStorage.removeItem("gametoken");

    try {
      const response = await axios.post("http://localhost:5001/api/auth/register", {
        email: userName,
      });

      refval.current = response.data.message;

      if (response.data.success) {
        setMessage(refval.current || "✅ Created successfully!");
        setTimeout(() => navigate("/send-otp"), 50);  
      } else {
        setError(refval.current || "Something went wrong!");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Server error occurred!");
      } else {
        setError("Unable to connect to the server!");
      }
    } finally {
      setLoading(false);
      console.log("Ref value:", refval.current);
      navigate("/send-otp");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="w-full max-w-md p-8 text-center bg-white/10 backdrop-blur-md rounded-2xl">
        <h1 className="mb-6 text-3xl font-bold text-white">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 text-gray-800 rounded-md outline-none bg-white/80"
            value={userName}
            onChange={changeName}
            required
          />

          {error && <p className="text-red-200">{error}</p>}
          {message && <p className="text-green-200">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-indigo-600 transition bg-white rounded-md hover:bg-gray-100 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Create"}
          </button>
        </form>

        <p className="mt-6 text-white/80">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/auth")}
            className="font-semibold text-yellow-300 underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
