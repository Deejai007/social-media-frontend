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
