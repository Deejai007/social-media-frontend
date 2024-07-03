import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosApi from "utils/axiosconfig";
import { UserState } from "redux/types/user";
import { log } from "console";

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Async actions
export const getUser = createAsyncThunk(
  "user/getUser",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post("/user/register", {
        headers: { Authorization: token },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
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
      const response = await axiosApi.post("/user/register", userData);
      console.log("====================================");
      console.log(response.data);
      console.log("====================================");
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
      const response = await axiosApi.post("/user/login", userData);
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
      console.log(response.data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const forgotResetPassword = createAsyncThunk(
  "user/forgotResetPassword",
  async (
    resetData: { email: string; otp: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post("/api/forgotresetPassword", resetData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  },
);