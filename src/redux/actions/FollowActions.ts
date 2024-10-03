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
};

// send follow request
export const sendFollowRequest = createAsyncThunk(
  "follow/sendfollowreq",
  async (followingId: string, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post("/follow/sendreq", {
        followingId: followingId,
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);
// get pending requests
export const getPendingRequests = createAsyncThunk(
  "follow/getrequests",
  async (_, { rejectWithValue }) => {
    try {
      // console.log("hi");
      const response = await axiosApi.get("/follow/get-pending-requests");
      // console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);
// accept request
export const acceptFollowRequest = createAsyncThunk(
  "follow/acceptreq",
  async (followerId: string, { rejectWithValue }) => {
    try {
      console.log("hi");
      const response = await axiosApi.post("/follow/acceptreq", {
        followerId: followerId,
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);
// reject request
export const RejectFollowRequest = createAsyncThunk(
  "follow/rejectreq",
  async (followerId: string, { rejectWithValue }) => {
    try {
      console.log("req to reject");
      const response = await axiosApi.post("/follow/rejectreq", {
        followerId: followerId,
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);
// unfollow user
export const unfollowUser = createAsyncThunk(
  "follow/unfollowuser",
  async (followerId: string, { rejectWithValue }) => {
    try {
      console.log("hi");
      const response = await axiosApi.post("/follow/unfollow-user", {
        followingId: followerId,
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);
