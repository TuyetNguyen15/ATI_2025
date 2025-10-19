import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  avatar: "",
  coverImage: "",
  age: null,
  gender: "",
  height: null,
  weight: null,
  job: "",
  email: "",
  password: "",
  zodiac: "",
  sun: "",
    moon: "",
    mercury: "",
    venus: "",
    mars: "",
    jupiter: "",
    saturn: "",
    uranus: "",
    neptune: "",
    house1: "",
  house2: "",
  house3: "",
  house4: "",
  house5: "",
  house6: "",
  house7: "",
  house8: "",
  house9: "",
  house10: "",
  house11: "",
  house12: "",
  conjunctionAspect: "",
  oppositionAspect: "",
  trineAspect: "",
  squareAspect: "",
  sextileAspect: "",
  natalChartImage: "",
  fireRatio: null,
  earthRatio: null,
  airRatio: null,
  waterRatio: null,

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