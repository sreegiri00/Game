import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authRedux/authSlice";
import gameReducer from "./authRedux/gameSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
  },
});
