import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import axiosApi from "utils/axiosconfig";
import { UserState } from "redux/types/user";
import { log } from "console";

const initialState: UserState = {
  user: null,
  isFollowing: null,
  loading: false,
  error: null,
  followList: [],
  successMessage: null,
};

// Async actions
export const getUserProfile = createAsyncThunk(
  "user/getUser",
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get(`/user/getuser/${username}`);
      console.log("User fetched data:");
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);

export const register = createAsyncThunk(
  "user/register",
  async (
    userData: {
      email: string;
      password: string;
    },
    { rejectWithValue },
  ) => {
    try {
      // console.log(userData);

      const response = await axiosApi.post("/user/register", userData);

      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);
export const sendOtp = createAsyncThunk(
  "user/sendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post("/user/verifysendotp", { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const verify = createAsyncThunk(
  "user/verify",
  async (
    verificationData: { email: string; otp: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosApi.post("/user/verify", verificationData);
      // console.log("====================================");
      // console.log(response);
      // console.log("====================================");
      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);

export const login = createAsyncThunk(
  "user/login",
  async (
    userData: {
      email: string;
      password: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosApi.post("/user/login", userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post("/user/forgotpassword", { email });
      // console.log(response.data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const forgotResetPassword = createAsyncThunk(
  "user/forgotResetPassword",
  async (resetData: object, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post(
        "/user/forgotresetPassword",
        resetData,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const addUserData = createAsyncThunk(
  "user/addUserData",
  async (formData: object, { rejectWithValue }) => {
    try {
      console.log(formData);

      const response = await axiosApi.post("/user/addUserData", { formData });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);
// export const Logout = createAsyncThunk(
//   "user/logout",
//   async (_, { rejectWithValue }) => {},
// );

// export const logout = () => {
//   console.log("====================================");
//   console.log("Hi");
//   console.log("====================================");
//   return { type: "auth/logout" };
// };
export const logout = createAction("LOGOUT");
