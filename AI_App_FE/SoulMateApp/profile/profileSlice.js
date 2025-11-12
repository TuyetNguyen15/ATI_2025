// redux/profileSlice.js (Updated)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uid: "",  
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
  
  // Planets 
  sun: "",
  moon: "",
  mercury: "",
  venus: "",
  mars: "",
  jupiter: "",
  saturn: "",
  uranus: "",
  neptune: "",
  pluto: "",
  ascendant: "",
  descendant: "",
  mc: "",
  ic: "",
  
  // Houses
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
  
  // Aspects
  conjunctionAspect: "",
  oppositionAspect: "",
  trineAspect: "",
  squareAspect: "",
  sextileAspect: "",
  
  // Natal Chart
  natalChartImage: "",
  
  // Elemental Ratios
  fireRatio: null,
  earthRatio: null,
  airRatio: null,
  waterRatio: null,
  
  // Other
  personalInfo: {},
  matchedHistory: [],
  status: "idle", // idle | loading | success | error
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Set toàn bộ profile data
    setProfileData: (state, action) => {
      return { ...state, ...action.payload };
    },
    
    // Update một field cụ thể
    updateProfileField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    
    // Set matched history
    setMatchedHistory: (state, action) => {
      state.matchedHistory = action.payload;
    },
    
    // Set status
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    
    // Reset profile về initial state
    resetProfile: () => initialState,
  },
});

export const { 
  setProfileData, 
  updateProfileField, 
  setMatchedHistory, 
  setStatus, 
  resetProfile 
} = profileSlice.actions;

export default profileSlice.reducer;