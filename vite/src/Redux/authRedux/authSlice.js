import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// Safe token decoding
let decoded = {};
try {
  const token = localStorage.getItem("token");
  if (token) {
    decoded = jwtDecode(token);
  }
} catch (err) {
  console.warn("Invalid or missing token:", err);
  decoded = {};
}

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    userName: decoded.email || "",
    userOtp: "0000",
    userPas: "",
    userRole: decoded.role || "",
    userId: decoded.id || "",
  },
  reducers: {
    change_userName: (state, action) => {
      state.userName = action.payload;
    },
    change_userOtp: (state, action) => {
      state.userOtp = action.payload;
    },
    change_userPas: (state, action) => {
      state.userPas = action.payload;
    },
  },
});

export const { change_userName, change_userOtp, change_userPas } = authSlice.actions;
export default authSlice.reducer;
