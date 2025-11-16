import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "../screens/my_profile/profileSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});
