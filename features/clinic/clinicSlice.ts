import { apiClient } from "@/lib/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ------------------- Async Thunks -------------------
export const addClinic = createAsyncThunk(
  "user/addClinic",
  async ({ userId, data }: { userId: any; data: any }) => {
    const res = await apiClient.post(`/clinic/${userId}`, data);
    return res.data;
  }
);

export const updateClinic = createAsyncThunk(
  "user/updateClinic",
  async ({ id, data }: { id: any; data: any }) => {
    const res = await apiClient.put(`/clinic/${id}`, data);
    return res.data;
  }
);

export const deleteClinic = createAsyncThunk(
  "user/deleteClinic",
  async ({ id }: { id: any }) => {
    const res = await apiClient.delete(`/clinic/${id}`);
    return { id, ...res.data };
  }
);

export const fetchUser = createAsyncThunk("user/fetch", async (id: any) => {
  const res = await apiClient.get(`/users/${id}`);
  return res.data;
});

// ------------------- Initial State -------------------
const initialState = {
  loading: false,
  updating: false,
  deleting: false,
  adding: false,
  user: null as any,
  error: null as string | null,
};

// ------------------- Slice -------------------
const clinicSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ------------------- Fetch User -------------------
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      })

      // ------------------- Add Clinic -------------------
      .addCase(addClinic.pending, (state) => {
        state.adding = true;
        state.error = null;
      })
      .addCase(addClinic.fulfilled, (state, action) => {
        state.adding = false;
        if (!state.user?.clinics) state.user.clinics = [];
        state.user.clinics.push(action.payload.clinic);
      })
      .addCase(addClinic.rejected, (state, action) => {
        state.adding = false;
        state.error = action.error.message || "Failed to add clinic";
      })

      // ------------------- Update Clinic -------------------
      .addCase(updateClinic.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateClinic.fulfilled, (state, action) => {
        state.updating = false;
        const updatedClinic = action.payload;

        if (state.user?.clinics) {
          const index = state.user.clinics.findIndex(
            (c: any) => c._id === updatedClinic._id
          );
          if (index !== -1) {
            state.user.clinics[index] = updatedClinic;
          } else {
            state.user.clinics.push(updatedClinic);
          }
        }
      })
      .addCase(updateClinic.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || "Failed to update clinic";
      })

      // ------------------- Delete Clinic -------------------
      .addCase(deleteClinic.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteClinic.fulfilled, (state, action) => {
        state.deleting = false;
        if (state.user?.clinics) {
          state.user.clinics = state.user.clinics.filter(
            (c: any) => c._id !== action.payload.id
          );
        }
      })
      .addCase(deleteClinic.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.error.message || "Failed to delete clinic";
      });
  },
});

export default clinicSlice.reducer;
