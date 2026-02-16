import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserDataState {
  userInfo: number;
}

const initialState: UserDataState = {
  userInfo: 1,
};

export const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    userDataAction: (state, action: PayloadAction<number>) => {
      state.userInfo = action.payload;
    },
  },
});

export const { userDataAction } = userDataSlice.actions;
export default userDataSlice.reducer;
