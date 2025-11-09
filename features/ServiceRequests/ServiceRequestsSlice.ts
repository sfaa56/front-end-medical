import { apiClient } from "@/lib/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteServiceRequest,
  getServiceRequestById,
  updateServiceRequest,
} from "./serviceRequest";
import { toast } from "sonner";

interface ServiceRequest {
  serviceRequests: any[];
  isLoading: boolean;
  isSuccess: boolean;
  message: string;
  isError: boolean;
  isUpdating: boolean;
  error: string | null;
  meta: any;
  currentRequest: any;
}

const initialState: ServiceRequest = {
  serviceRequests: [],
  meta: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  isUpdating: false,
  message: "",
  error: null,
  currentRequest: {},
};

export const fetchServiceRequests = createAsyncThunk(
  "user/fetch",
  async (params: any, thunkAPI: any) => {
    try {
      const query = new URLSearchParams();

      if (params.page) query.set("page", params.page.toString());
      if (params.limit) query.set("limit", params.limit.toString());
      if (params.title) query.set("title", params.title);
      if (params.specialty) query.set("specialty", params.specialty);
      if (params.status) query.set("status", params.status);

      const res = await apiClient.get(`/serviceRequest?${query.toString()}`);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to fetch serviceRequests"
      );
    }
  }
);

export const fetchRequestById = createAsyncThunk(
  "serviceRequest/fetchById",
  async (id: string, thunkAPI) => {
    try {
      return await getServiceRequestById(id);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message;
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// 🟡 تحديث طلب
export const editRequest = createAsyncThunk(
  "serviceRequest/update",
  async ({ id, data }: { id: string; data: any }, thunkAPI) => {
    try {
      const res = await updateServiceRequest(id, data);
      toast.success("Service request updated successfully");
      return res;
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message;
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// 🔴 حذف طلب
export const removeRequest = createAsyncThunk(
  "serviceRequest/delete",
  async (id: string, thunkAPI) => {
    try {
      await deleteServiceRequest(id);
      toast.success("Service request deleted successfully");
      return id;
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message;
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const serviceRequestSlice = createSlice({
  name: "serviceRequests",
  initialState,
  reducers: {
    resetRequestState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.isUpdating = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServiceRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.serviceRequests = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchServiceRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRequestById.fulfilled, (state, action) => {
        state.currentRequest = action.payload;
      })
      // UPDATE
      .addCase(editRequest.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.isSuccess = true;
        const index = state.serviceRequests.findIndex(
          (r: any) => r._id === action.payload._id
        );
        if (index !== -1) state.serviceRequests[index] = action.payload;
      })
      .addCase(editRequest.rejected, (state, action) => {
        state.isUpdating = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // DELETE
      .addCase(removeRequest.fulfilled, (state, action) => {
        state.serviceRequests = state.serviceRequests.filter(
          (r: any) => r._id !== action.payload
        );
      });
  },
});

export default serviceRequestSlice.reducer;
