import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosApi from "utils/axiosconfig";
import { UserState } from "redux/types/user";
const initialState: UserState = {
  user: null,
  isFollowing: null,
  loading: false,
  error: null,
  successMessage: null,
  followList: [],
  websocket: null,
};

const getErrorPayload = (error: unknown) =>
  axios.isAxiosError(error)
    ? error.response?.data ?? error.message
    : "Request failed.";

// send follow request
export const sendFollowRequest = createAsyncThunk(
  "follow/sendfollowreq",
  async (followingId: string, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post("/follow/sendreq", {
        followingId: followingId,
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);
// get pending requests
export const getPendingRequests = createAsyncThunk(
  "follow/getrequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get("/follow/get-pending-requests");
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);
// accept request
export const acceptFollowRequest = createAsyncThunk(
  "follow/acceptreq",
  async (followerId: string, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post("/follow/acceptreq", {
        followerId: followerId,
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);
// reject request
export const RejectFollowRequest = createAsyncThunk(
  "follow/rejectreq",
  async (followerId: string, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post("/follow/rejectreq", {
        followerId: followerId,
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);
// unfollow user
export const unfollowUser = createAsyncThunk(
  "follow/unfollowuser",
  async (
    userData: {
      followingId: string;
      mode: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosApi.post("/follow/unfollow-user", {
        userData,
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);
// get followers or followings list
export const getFollowList = createAsyncThunk(
  "follow/getFollowList",
  async (
    params: { userId: string; mode: "followers" | "followings" },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosApi.get(
        `/follow/list/${params.userId}?mode=${params.mode}`,
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorPayload(error));
    }
  },
);

const followSlice = createSlice({
  name: "follow",
  initialState: {
    ...initialState,
    followList: [],
    followListLoading: false,
    followListError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendFollowRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendFollowRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(sendFollowRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(getPendingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(getPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(acceptFollowRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptFollowRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(acceptFollowRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(RejectFollowRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(RejectFollowRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(RejectFollowRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | "Failed to unfollow user";
      })
      .addCase(getFollowList.pending, (state) => {
        state.followListLoading = true;
        state.followListError = null;
      })
      .addCase(getFollowList.fulfilled, (state, action) => {
        state.followListLoading = false;
        state.followList = action.payload.data || [];
      })
      .addCase(getFollowList.rejected, (state, action) => {
        state.followListLoading = false;
        state.error = action.payload as string | "Failed to fetch follow list";
      });
  },
});

export default followSlice.reducer;
