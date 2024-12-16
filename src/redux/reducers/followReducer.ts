import { createSlice } from "@reduxjs/toolkit";

import { UserState } from "../types/user";
import {
  acceptFollowRequest,
  getPendingRequests,
  sendFollowRequest,
  unfollowUser,
} from "redux/actions/FollowActions";
const initialState: UserState = {
  user: null,
  isFollowing: null,
  loading: false,
  error: null,
  successMessage: null,
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
      })
      .addCase(getPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload);
      })
      .addCase(getPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
      })
      .addCase(acceptFollowRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.error);
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
