import { toast } from "sonner";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/app/(root)/users/columns";
import * as userApi from "./userApi";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};


export const fetchUsers = createAsyncThunk<User[], { page: number; limit: number }>(
  "user/fetchUsers",
  async ({ page, limit }, thunkAPI) => {
    try {
      const response = await userApi.fetchUsers(page, limit);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error || error?.message || "Failed to fetch users"
      );
    }
  }
);




export const approveUser = createAsyncThunk<string, string>(
  "user/approveUser",
  async (userId, thunkAPI) => {
    try {
      const response = await userApi.approveUser(userId);
      toast.success("User approved successfully");
      return userId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error || error?.message || "Failed to approve user"
      );
    }
  }
);


export const deleteUser = createAsyncThunk<string, string>(
  "user/deleteUser",
  async (userId, thunkAPI) => {
    try {
      const response = await userApi.deleteUser(userId);
      toast.success("User deleted successfully");
      return userId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error || error?.message || "Failed to delete user"
      );
    }
  }
);


export const blockUser = createAsyncThunk<User, string>(
  "user/blockUser",
  async (userId, thunkAPI) => {
    try {
      const response = await userApi.blockUser(userId);
      toast.success("User blocked successfully");
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error || error?.message || "Failed to block user"
      );
    }
  }
);


export const unblockUser = createAsyncThunk<User, string>(
  "user/unblockUser",
  async (userId, thunkAPI) => {
    try {
      const response = await userApi.unblockUser(userId);
      toast.success("User unblocked successfully");
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error || error?.message || "Failed to unblock user"
      );
    }
  }
);



export const getUserById = createAsyncThunk<User, string>(
  "user/getUserById",
  async (userId, thunkAPI) => {
    try {
      const response = await userApi.getUserById(userId);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error || error?.message || "Failed to fetch user"
      );
    }
  }
);


export const updateUser = createAsyncThunk<User, { userId: string; userData: any }>(
  "user/updateUser",
  async ({ userId, userData }, thunkAPI) => {
    try {
      const response = await userApi.updateUser(userId, userData);
      toast.success("User updated successfully");
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error || error?.message || "Failed to update user"
      );
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users?.filter(user => user._id !== action.payload);
      })
      .addCase(approveUser.fulfilled, (state, action) => {
        const index = state.users?.findIndex(user => user._id === action.payload);
        if (index !== undefined && index >= 0) {
          state.users[index].isVerified = true;
        }
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        const index = state.users?.findIndex(user => user._id === action.payload._id);
        if (index !== undefined && index >= 0) {
          state.users[index] = action.payload;
        }
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        const index = state.users?.findIndex(user => user._id === action.payload._id);
        if (index !== undefined && index >= 0) {
          state.users[index] = action.payload;
        }
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        // Handle the fetched user data if needed
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users?.findIndex(user => user._id === action.payload._id);
        if (index !== undefined && index >= 0) {
          state.users[index] = action.payload;
        }
      });
  },
});

export default userSlice.reducer;