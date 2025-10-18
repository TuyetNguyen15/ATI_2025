import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  avatar: "",
  coverPage: "",
  zodiac: "",
  personalInfo: {},
  matchedHistory: [],
  status: "idle", // idle | loading | success | error
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      const { name, avatar, coverPage, zodiac, personalInfo } = action.payload;
      state.name = name;
      state.avatar = avatar;
      state.coverPage = coverPage;
      state.zodiac = zodiac;
      state.personalInfo = personalInfo;
    },
    setMatchedHistory: (state, action) => {
      state.matchedHistory = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setProfileData, setMatchedHistory, setStatus } = profileSlice.actions;
export default profileSlice.reducer;