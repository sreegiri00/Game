import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Auth from "./pages/Auth";
// import Game from "./pages/Game"; // your game page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        {/* <Route path="/game" element={<Game />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
