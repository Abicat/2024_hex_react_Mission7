import { configureStore } from '@reduxjs/toolkit';
import messageReducer from "../redux/messageReducer";
import loadingReducer from "../redux/loadingReducer";
import authReducer from "../redux/authReducer"

export const store = configureStore({
  reducer: {
    message: messageReducer,
    loading: loadingReducer, // 設定 loading reducer
    auth: authReducer,
  },
});

export default store;