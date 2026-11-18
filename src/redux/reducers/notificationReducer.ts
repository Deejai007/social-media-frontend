import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNotifications,
  markNotificationRead,
} from "redux/actions/NotificationActions";
import { NotificationState } from "redux/types/notification";

const initialState: NotificationState = {
  items: [],
  loading: false,
  error: null,
  markingNotificationId: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error.message ||
          "Unable to load notifications.";
      })
      .addCase(markNotificationRead.pending, (state, action) => {
        state.markingNotificationId = action.meta.arg;
        state.error = null;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.markingNotificationId = null;
        const notification = state.items.find(
          (item) => item.id === action.payload,
        );
        if (notification) notification.isRead = true;
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.markingNotificationId = null;
        state.error =
          action.payload ||
          action.error.message ||
          "Unable to update notification.";
      });
  },
});

export default notificationSlice.reducer;
