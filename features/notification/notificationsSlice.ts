// ...existing code...
import { apiClient } from "@/lib/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";



export type NotificationType =
  | "booking_created"
  | "booking_accepted"
  | "booking_rejected"
  | "appointment_created"
  | "appointment_cancelled"
  | "appointment_completed"
  | "followup_booked"
  | "booking_updated"
  | "booking_cancelled";

export type Notification = {
  _id: string;
  recipientId: string;
  senderId?: any;
  type: NotificationType;
  message: string;
  relatedId?: string | null;
  data?: Record<string, any> | null;
  seen: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type NotificationsState = {
  items: Notification[];
  loading: boolean;
  unreadCount: number;
};

type ThunkAPIState = { state: any };

// Async thunks with types
export const fetchNotifications = createAsyncThunk<Notification[], void, ThunkAPIState>(
  "notifications/fetch",
  async (_, thunkAPI) => {

    const res = await apiClient.get(`/notification`);
    return res.data.data as Notification[];
  }
);

export const markAsSeen = createAsyncThunk<Notification, string, ThunkAPIState>(
  "notifications/markAsSeen",
  async (id, thunkAPI) => {

    const res = await apiClient.patch(`/notification/${id}/seen`);
    return res.data.data as Notification;
  }
);

export const markAllAsSeen = createAsyncThunk<boolean, void, ThunkAPIState>(
  "notifications/markAll",
  async (_, thunkAPI) => {

    await apiClient.patch(`/notification/seen-all`);
    return true;
  }
);

const initialState: NotificationsState = {
  items: [],
  loading: false,
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    pushNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
      state.unreadCount += action.payload.seen ? 0 : 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (s, a: PayloadAction<Notification[]>) => {
        s.loading = false;
        s.items = a.payload;
        s.unreadCount = a.payload.filter((n) => !n.seen).length;
      })
      .addCase(fetchNotifications.rejected, (s) => {
        s.loading = false;
      })
      .addCase(markAsSeen.fulfilled, (s, a: PayloadAction<Notification>) => {
        const idx = s.items.findIndex((i) => i._id === a.payload._id);
        if (idx !== -1) {
          s.items[idx] = a.payload;
        }
        s.unreadCount = s.items.filter((n) => !n.seen).length;
      })
      .addCase(markAllAsSeen.fulfilled, (s) => {
        s.items = s.items.map((i) => ({ ...i, seen: true }));
        s.unreadCount = 0;
      });
  },
});

export const { pushNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
// ...existing code...