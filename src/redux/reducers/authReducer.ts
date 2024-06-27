import {
  forgotResetPassword,
  forgotSendOtp,
  getUser,
  login,
  register,
  sendOtp,
  verify
} from 'redux/actions/userActions'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { UserState } from '../types/user'
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  successMessage: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        console.log(action.payload)
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = action.payload.msg
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(verify.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verify.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = action.payload.msg
      })
      .addCase(verify.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(sendOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = action.payload.msg
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.successMessage = action.payload.msg
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(forgotSendOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(forgotSendOtp.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = action.payload.msg
      })
      .addCase(forgotSendOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(forgotResetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(forgotResetPassword.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = action.payload.msg
      })
      .addCase(forgotResetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError, clearSuccessMessage } = userSlice.actions
export default userSlice.reducer
