import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './reducer/auth.reducer';
import drawerSlice from './reducer/drawer.visibility';
const rootReducer = combineReducers({
  drawer: drawerSlice.reducer,
  auth: authSlice.reducer,
  //   login: loginSlice.reducer,
  //   visitType: visitTypeSlice.reducer,
});
export default rootReducer;