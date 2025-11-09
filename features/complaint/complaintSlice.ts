import { apiClient } from "@/lib/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// FETCH with filter/search/pagination
export const fetchComplaints = createAsyncThunk<any, any>(
  "complaints/fetchAll",
  async ({ page = 1, limit = 10, status = "All", search = "",type="" }, thunkAPI) => {
    try {
      const res = await apiClient.get("/complaints/all", {
        params: { page, limit, status, search ,type},
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch");
    }
  }
);

// UPDATE STATUS / RESPONSE
export const updateComplaint = createAsyncThunk<any, any>(
  "complaints/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await apiClient.put(`/complaints/${id}`, data);
      return res.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to update");
    }
  }
);

const complaintSlice = createSlice({
  name: "complaints",
  initialState: {
    items: [],
    meta: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
    loading: true,
    updating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta;
        state.error = null;
      })
      .addCase(fetchComplaints.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateComplaint.fulfilled, (state: any, action: any) => {
        state.updating = false;
        const updated = action.payload;
        const index = state.items.findIndex((c) => c._id === updated._id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            status: updated.status,
            officialResponse: updated.officialResponse,
          };
        }
      })
      .addCase(updateComplaint.pending, (state: any, action: any) => {
        state.updating = true;
      })
      .addCase(updateComplaint.rejected, (state: any, action: any) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export default complaintSlice.reducer;
