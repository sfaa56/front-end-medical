import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { User, UserRegisterResponse, registerSchema } from "@/types/user";
import * as authApi from "./authApi";



interface AuthState {
  user: User | null;
  loading: boolean;
  passwordLoading: boolean;
  error: string | null;
  token: string | null;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  message: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  passwordLoading: false,
  error: null,
  token: null,
  isSuccess: false,
  isError: false,
  isLoading: false,
  message: "",
};

// Asyncthunk for register
export const registerUser = createAsyncThunk<
  UserRegisterResponse,
  authApi.RegisterPayload
>("auth/registerUser", async (userData, thunkAPI) => {
  try {
    return await authApi.register(userData);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.error || "Something went wrong"
    );
  }
});

// what the thunk will eventually return,  // type of the argument (payload)
export const loginUser = createAsyncThunk<any, authApi.LoginPayload>(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const response = await authApi.login(data); // { user, token }
      console.log("response111", response);

      const dataWithExpiry = {
        ...response,
        expiry: Date.now() + 5 * 60 * 60 * 1000, // ⏰ expires in 5 hours
      };

      localStorage.setItem("user", JSON.stringify(dataWithExpiry));

      return response;
    } catch (error: any) {
      console.error("Login error:", error); // <--- Add this line
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error || error?.message || "Login failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async (thunkAPI) => {
  try {
    await authApi.logout();
  } catch (error) {
    console.error("Login error:", error); // <--- Add this line
    return "Login failed";
  }
});

export const updateAdmin = createAsyncThunk<User, authApi.UpdatePayload>(
  "auth/update",
  async (data, thunkAPI) => {
    try {
      console.log("data", data);
      const response = await authApi.update(data); // { user, token }

      localStorage.setItem("user", JSON.stringify(response));

      return response;
    } catch (error: any) {
      console.log("login error", error);
      return thunkAPI.rejectWithValue(error?.message || "Login failed");
    }
  }
);

export const password = createAsyncThunk<string, authApi.changePasswordPayload>(
  "auth/password",
  async (data, { rejectWithValue }) => {
    try {
      return await authApi.changePassword(data);
    } catch (error) {
      console.error("Change password error", error);
      return rejectWithValue("Change Password failed");
    }
  }
);

export const picture = createAsyncThunk<User, authApi.picture>(
  "auth/picture",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.picture(data);
      localStorage.setItem("user", JSON.stringify(res));

      return res;
    } catch (error) {
      console.error("Change password error", error);
      return rejectWithValue("Change Password failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserFromStorage: (state, action) => {
      state.user = action.payload.user;
    },

    reset: (state) => {
      state.loading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        localStorage.removeItem("user");
        state.user = null;
      })
      .addCase(updateAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update user info here if your API returns updated user
        state.user = action.payload;
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(password.pending, (state) => {
        state.passwordLoading = false;
        state.error = null;
      })
      .addCase(password.fulfilled, (state) => {
        state.passwordLoading = false;
      })
      .addCase(password.rejected, (state, action) => {
        state.passwordLoading = false;
        state.error = action.payload as string;
      })
      .addCase(picture.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;

        // If 'message' does not exist, set to null or extract from elsewhere
        state.message = (action.payload as any).message || null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      });
  },
});

export const { setUserFromStorage, reset } = authSlice.actions;
export default authSlice.reducer;
