import { createSlice } from "@reduxjs/toolkit";

import { UserState } from "../types/user";
import {
  acceptFollowRequest,
  getPendingRequests,
  RejectFollowRequest,
  sendFollowRequest,
  unfollowUser,
} from "redux/actions/FollowActions";

export interface PendingFollowRequest {
  followerId: string | number;
  followerUsername: string | null;
  followerProfileImage: string | null;
}

type FollowState = UserState & {
  pendingRequests: PendingFollowRequest[];
  pendingRequestsLoading: boolean;
  pendingRequestsError: string | null;
};

const initialState: FollowState = {
  user: null,
  isFollowing: null,
  loading: false,
  error: null,
  successMessage: null,
  followList: [],
  websocket: null,
  pendingRequests: [],
  pendingRequestsLoading: false,
  pendingRequestsError: null,
};

const followSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //send follow request
      .addCase(sendFollowRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendFollowRequest.fulfilled, (state, action) => {
        state.loading = false;
        console.log(
          "Follow request status update to ",
          action.payload.data.status,
        );
        state.isFollowing = action.payload.data.status;
      })
      .addCase(sendFollowRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.payload);
      })
      //get pending requests
      .addCase(getPendingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.pendingRequestsLoading = true;
        state.pendingRequestsError = null;
      })
      .addCase(getPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequestsLoading = false;
        state.pendingRequests = action.payload.data || [];
      })
      .addCase(getPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.pendingRequestsLoading = false;
        state.pendingRequestsError =
          typeof action.payload === "string"
            ? action.payload
            : action.error.message || "Unable to load follow requests.";
        console.log(action.error);
      })
      //accept req
      .addCase(acceptFollowRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptFollowRequest.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        if (action.payload.success) {
          state.pendingRequests = (state.pendingRequests ?? []).filter(
            (request) => String(request.followerId) !== action.meta.arg,
          );
        }
      })
      .addCase(acceptFollowRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.error);
      })
      .addCase(RejectFollowRequest.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.pendingRequests = (state.pendingRequests ?? []).filter(
            (request) => String(request.followerId) !== action.meta.arg,
          );
        }
      })
      .addCase(RejectFollowRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //unfollow userfoll
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isFollowing = null;

        console.log("User unfollowed: ", action.payload);
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.error);
      });
  },
});

export const { clearError, clearSuccessMessage } = followSlice.actions;
export default followSlice.reducer;
