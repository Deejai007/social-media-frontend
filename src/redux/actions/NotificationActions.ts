import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosApi from "utils/axiosconfig";
import { NotificationItem } from "redux/types/notification";

export const fetchNotifications = createAsyncThunk<
  NotificationItem[],
  void,
  { rejectValue: string }
>("notifications/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosApi.get("/notifications");
    return response.data.data;
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message
      : undefined;
    return rejectWithValue(message || "Unable to load notifications.");
  }
});

export const markNotificationRead = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("notifications/markRead", async (notificationId, { rejectWithValue }) => {
  try {
    await axiosApi.patch(`/notifications/${notificationId}/read`);
    return notificationId;
  } catch (error: unknown) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message
      : undefined;
    return rejectWithValue(message || "Unable to update notification.");
  }
});
