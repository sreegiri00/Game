import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { change_userName } from "../../Redux/authRedux/authSlice";

const Sendotp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const refval = useRef(""); // store the server message

  const userName = useSelector((state) => state.auth.userName);

  const changeName = (e) => {
    dispatch(change_userName(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5001/api/auth/otpSend", {
        email: userName,
      });

      refval.current = response.data.message;

      if (response.data.success) {
        setMessage(refval.current || "✅ Created successfully!");
        setTimeout(() => navigate("/verify-otp"), 500);
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

      // Example use of ref value
      if (refval.current === "OTP sent") {
        navigate("/verify-otp");
      }
      console.log("Ref value:", refval.current);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="w-full max-w-md p-8 text-center bg-white/10 backdrop-blur-md rounded-2xl">
        <h1 className="mb-6 text-3xl font-bold text-white">OTP</h1>

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
            {loading ? "Sending..." : "OTP"}
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default Sendotp;
