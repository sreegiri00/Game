import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

let decoded = {};
try {
  const tokengame = localStorage.getItem("token");
  if (tokengame) {
    decoded = jwtDecode(tokengame);
  }
} catch (err) {
  console.warn("Invalid or missing token:", err);
  decoded = {};
}


export const gameSlice = createSlice({
  name: "game",
  initialState: {
    userGameMove: "0000",
    userGameId: "0000",
    userGamepass: "0000",
  },
  reducers: {
    change_userGameMove: (state, action) => {
      state.userGameMove = action.payload;
    },
    change_userGameId: (state, action) => {
      state.userGameId = action.payload;
    },
    change_userGamePass: (state, action) => {
      state.userGamepass = action.payload;
    },
  },
});

export const { change_userGamePass , change_userGameMove, change_userGameId } = gameSlice.actions;

export default gameSlice.reducer;
