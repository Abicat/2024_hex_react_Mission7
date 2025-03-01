import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const { VITE_BASE_URL: BASE_URL, VITE_API_PATH: API_PATH } = import.meta.env;

const setAuthToken = (token, expired) => {
  if (token) {
    document.cookie = `authToken=${token};expires=${new Date(expired).toUTCString()};path=/`;
    axios.defaults.headers.common.Authorization = token;
  } else {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    delete axios.defaults.headers.common.Authorization;
  }
};

const getAuthToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
};

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/v2/admin/signin`, { username, password });
      const { token, expired } = res.data;
      setAuthToken(token, expired);
      return { token };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const checkLogin = createAsyncThunk("auth/checkLogin", async (_, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated");
    axios.defaults.headers.common.Authorization = token;
    await axios.post(`${BASE_URL}/v2/api/user/check`);
    return { token };
  } catch (error) {
    setAuthToken(null);
    return rejectWithValue("Not authenticated");
  }
});

export const logoutAdmin = createAsyncThunk("auth/logoutAdmin", async (_, { rejectWithValue }) => {
  try {
    await axios.post(`${BASE_URL}/v2/logout`);
    setAuthToken(null);
  } catch (error) {
    return rejectWithValue(error.response?.data || "Logout failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: { token: null, status: "idle", error: null },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.status = "logged-in";
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(checkLogin.pending, (state) => {
        state.status = "checking";
      })
      .addCase(checkLogin.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.status = "logged-in";
      })
      .addCase(checkLogin.rejected, (state, action) => {
        state.token = null;
        state.status = "idle";
        state.error = action.payload;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.token = null;
        state.status = "idle";
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;