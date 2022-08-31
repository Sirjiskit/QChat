import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILoggerInfo } from '../../interface/logger.info';
export const initialState: ILoggerInfo = {
  isAuth: false,
  isLoading: false,
  isLogin: false,
  error: { message: '' },
};
export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLoginLoading: (state: { isLoading: boolean; }, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setUserLoginSuccess: (state: any, { payload }: PayloadAction<any>) => {
      state.currentUser = payload;
      state.isLogin = true;
    },
    setLoginFailed: (state: any, { payload }: PayloadAction<any>) => {
      state.error = payload;
      state.isLogin = false;
    },
    setLoginSuccess: (state: any, { payload }: PayloadAction<any>) => {
      state.error = payload;
      state.isLogin = true;
    },
  },
});
export const {
  setUserLoginSuccess,
  setLoginLoading,
  setLoginSuccess,
  setLoginFailed,
} = loginSlice.actions;
export default loginSlice;
