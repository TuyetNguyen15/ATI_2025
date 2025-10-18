import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  avatar: "",
  coverImage: "",
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
      const { name, avatar, coverImage, zodiac, personalInfo } = action.payload;
      state.name = name;
      state.avatar = avatar;
      state.coverImage = coverImage;
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