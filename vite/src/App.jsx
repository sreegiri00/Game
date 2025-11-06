import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Auth from "./pages/authfile/Auth";
import Register from "./pages/authfile/Register";
import Sendotp from "./pages/authfile/Sendotp";
import Verifyotp from "./pages/authfile/Verifyotp";
import Setpass from "./pages/authfile/Setpass";
import Bingo from "./pages/Bingo"; 
import Game from "./pages/Game"; 
// import Game from "./pages/Game"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/send-otp" element={<Sendotp />} />
        <Route path="/verify-otp" element={<Verifyotp />} />
        <Route path="/setpass" element={<Setpass />} />
        <Route path="/bingo" element={<Bingo />} />
        <Route path="/game" element={<Game />} />
        <Route path="/games/:gameId" element={<Game />} />
        {/* <Route path="/game" element={<Game />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
