// src/redux/actions/userActions.js

import axios from 'axios'
import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_VERIFY_REQUEST,
  USER_VERIFY_SUCCESS,
  USER_VERIFY_FAIL,
  USER_SEND_OTP_REQUEST,
  USER_SEND_OTP_SUCCESS,
  USER_SEND_OTP_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_FORGOT_SEND_OTP_REQUEST,
  USER_FORGOT_SEND_OTP_SUCCESS,
  USER_FORGOT_SEND_OTP_FAIL,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_SUCCESS,
  USER_RESET_PASSWORD_FAIL
} from './types'

// Register User Action
export const register = (userData) => async (dispatch) => {}

// Verify User Action
export const verify = (verificationData) => async (dispatch) => {}

// Send OTP Action
export const sendOTP = (otpData) => async (dispatch) => {}

// Login User Action
export const login = (loginData) => async (dispatch) => {}

// Forgot Password - Send OTP Action
export const forgotSendOTP = (emailData) => async (dispatch) => {}

// Forgot Password - Reset Password Action
export const forgotResetPassword = (resetData) => async (dispatch) => {}
