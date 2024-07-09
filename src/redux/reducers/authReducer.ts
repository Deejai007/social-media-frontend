import {
  forgotResetPassword,
  forgotPassword,
  getUserProfile,
  login,
  register,
  sendOtp,
  verify,
  addUserData,
} from "redux/actions/userActions";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { UserState } from "../types/user";
import { createLogger } from "vite";
const initialState: UserState = {
  user: null,
  isFollowing: false,
  loading: false,
  error: null,
  successMessage: null,
};

const userSlice = createSlice({
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
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isFollowing = action.payload.data.isFollowing;
        // console.log(state.user.user);
        // state.user = action.payload.data;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.payload);
      })
      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("State at register:", initialState);
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.successMessage = action.payload.message;
        console.log(action.payload);

        state.user = action.payload.data.user;
        console.log("State at register fulfil:", initialState);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log("State at register reject:", initialState);
      })
      // verify
      .addCase(verify.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verify.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        console.log("====================================");
        console.log(state.user);
        console.log("====================================");
        state.user.verified = true;
      })
      .addCase(verify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //send otp for verification
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.msg;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);

        state.user = action.payload.data.user;
        state.successMessage = action.payload.msg;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // forgot password send token
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.msg;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // reset password
      .addCase(forgotResetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotResetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.msg;
      })
      .addCase(forgotResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //add user data
      .addCase(addUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.msg;
      })
      .addCase(addUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccessMessage } = userSlice.actions;
export default userSlice.reducer;
