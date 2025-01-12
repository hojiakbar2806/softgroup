// src/features/modal/modalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  message: string;
  path: string;
  button: string;
}

const initialState: ModalState = {
  isOpen: false,
  message: "",
  path: "",
  button: "",
};

const loginMessageModalSlice = createSlice({
  name: "loginMessageModal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ message: string; path: string; button: string }>
    ) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.path = action.payload.path;
      state.button = action.payload.button;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.message = "";
      state.path = "";
    },
  },
});

export const { openModal, closeModal } = loginMessageModalSlice.actions;
export default loginMessageModalSlice.reducer;
