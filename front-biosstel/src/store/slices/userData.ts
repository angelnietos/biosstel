// store/slices/menu.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userData {
  userInfo: number;
}

const initialState: userData = {
  userInfo: 1,
};

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    userDataAction: (state, action: PayloadAction<number>) => {
      state.userInfo = action.payload;
    },
  },
});

export const { userDataAction } = userDataSlice.actions;
