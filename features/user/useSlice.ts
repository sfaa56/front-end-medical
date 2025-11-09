import { toast } from "sonner";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/app/(root)/users/columns";
import * as userApi from "./userApi";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  approvingUserId: string | null; // 👈 track who is being approved
  meta:any
}

const initialState: UserState = {
  users: [],
  meta:[],
  loading: false,
  error: null,
  approvingUserId: null,
};

export const fetchUsers = createAsyncThunk<any, any>(
  "user/fetchUsers",
  async (params, thunkAPI) => {
    try {
      const query = new URLSearchParams();

      if (params.page) query.set("page", params.page.toString());
      if (params.limit) query.set("limit", params.limit.toString());
      if (params.search) query.set("search", params.search);
      if (params.sort) query.set("sort", params.sort);
      if (params.specialty) query.set("specialty", params.specialty);
      if (params.role) query.set("role", params.role);
      if (params.isVerified !== undefined)
        query.set("isVerified", String(params.isVerified));

      const response = await userApi.fetchUsers(query);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to fetch users"
      );
    }
  }
);

export const approveUser = createAsyncThunk<string, string>(
  "user/approveUser",
  async (userId, thunkAPI) => {
    try {
      await userApi.approveUser(userId);
      toast.success("User approved successfully");
      return userId; // return the same id you passed in
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to approve user";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const deleteUser = createAsyncThunk<
  string, // return type (userId in your case)
  { userId: string; reason?: string } // argument type
>(
  "user/deleteUser",
  async ({ userId, reason }, thunkAPI) => {
    try {
      console.log("userId",userId)
      const response = await userApi.deleteUser(userId, reason);
      toast.success("User deleted successfully");
      return userId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to delete user"
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
        error?.response?.data?.error ||
          error?.message ||
          "Failed to unblock user"
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

export const updateUser = createAsyncThunk<
  User,
  { userId: string; userData: any }
>("user/updateUser", async ({ userId, userData }, thunkAPI) => {
  try {
    const response = await userApi.updateUser(userId, userData);
    toast.success("User updated successfully");
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.error || error?.message || "Failed to update user"
    );
  }
});

export const picture = createAsyncThunk<User, any>(
  "auth/picture",
  async (data, { rejectWithValue }) => {
    try {
      const res = await userApi.picture(data);
    
      return res.iamge;
    } catch (error) {
      console.error("Change password error", error);
      return rejectWithValue("Change Password failed");
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
        state.users = action.payload.data;
        state.meta =action.payload.meta
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users?.filter(
          (user) => user._id !== action.payload
        );
      })
      .addCase(approveUser.pending, (state, action) => {
        state.approvingUserId = action.meta.arg; // userId we’re approving
      })
      .addCase(approveUser.fulfilled, (state, action) => {


        const index = state.users?.findIndex(
          (user) => user._id === action.payload
        );
        if (index !== undefined && index >= 0) {
          state.users[index].isVerified = true;
        }

        console.log("users",state.users)
        console.log("index",index)

        console.log("test index",state.users[index])

        console.log("test verified",state.users[index].isVerified)

        state.approvingUserId = null; // reset after success
      })
      .addCase(approveUser.rejected, (state) => {
        state.approvingUserId = null; // reset after failure
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        const index = state.users?.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== undefined && index >= 0) {
          state.users[index] = action.payload;
        }
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        const index = state.users?.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== undefined && index >= 0) {
          state.users[index] = action.payload;
        }
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        // Handle the fetched user data if needed
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users?.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== undefined && index >= 0) {
          state.users[index] = action.payload;
        }
      });
  },
});

export default userSlice.reducer;
