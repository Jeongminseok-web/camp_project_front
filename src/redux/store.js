import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import modalItemReducer from "./slices/ModalItemSlice";
import apiReducer from "./slices/apiSlice";

const store = configureStore({
  reducer: {
    modalItem: modalItemReducer,
    auth: authReducer,
    api: apiReducer,
  },
});

export default store;
