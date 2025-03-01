import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    pushMessage(state, action) {
      const { title, text, status } = action.payload;
      const id = Date.now();
      // 確保不重複顯示相同的訊息
      if (!state.messages.some((message) => message.text === text)) {
        state.messages.push({ id, title, text, status });
      }
    },
    removeMessage(state, action) {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload
      );
    },
  },
});

export const createAsyncMessage = createAsyncThunk(
  "message/createAsyncMessage",
  async (payload, { dispatch, requestId }) => {
    dispatch(
      messageSlice.actions.pushMessage({
        ...payload,
        id: requestId,
      })
    );

    setTimeout(() => {
      dispatch(messageSlice.actions.removeMessage(requestId));
    }, 3000);
  }
);

export const { pushMessage, removeMessage } = messageSlice.actions;

export default messageSlice.reducer;
