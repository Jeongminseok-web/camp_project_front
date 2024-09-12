import { createSlice } from "@reduxjs/toolkit";

const modalItemSlice = createSlice({
  name: "modalItem",
  initialState: {
    isOpen: false,
    modalItemType: "create",
    task: null,
  },
  reducers: {
    openModalItem: (state, action) => {
      state.isOpen = true;
      state.modalItemType = action.payload.modalItemType;
      state.task = action.payload.task;
      // console.log(state.modalType, state.task);
    },
    closeModalItem: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openModalItem, closeModalItem } = modalItemSlice.actions;
export default modalItemSlice.reducer;
