import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  loadingText: "",
  variant: "fullscreen", // "fullscreen" or "small"
  type: "spinningBubbles", // "spinningBubbles", "loading01", "spin"
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    showLoading: (state, { payload }) => {
      state.isLoading = true;
      state.loadingText = payload?.loadingText ?? "Loading...";
      state.variant = payload?.variant ?? "fullscreen";
      state.type = payload?.type ?? "spinningBubbles";
    },
    hideLoading: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// **Async Loading 自動管理**
export const createAsyncLoading = createAsyncThunk(
  "loading/createAsyncLoading",
  async (
    {
      loadingText,
      variant = "fullscreen",
      asyncFunction,
      successMessage,
      errorMessage,
    },
    { dispatch }
  ) => {
    dispatch(loadingSlice.actions.showLoading({ loadingText, variant }));

    try {
      await asyncFunction();
      if (successMessage) {
        dispatch(
          createAsyncMessage({
            title: "成功",
            text: successMessage,
            status: "success",
          })
        );
      }
    } catch (error) {
      const errorMsg =
        errorMessage || error?.response?.data?.message || "發生錯誤";
      dispatch(
        createAsyncMessage({ title: "錯誤", text: errorMsg, status: "failed" })
      );
    } finally {
      dispatch(loadingSlice.actions.hideLoading());
    }
  }
);

export const { showLoading, hideLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
