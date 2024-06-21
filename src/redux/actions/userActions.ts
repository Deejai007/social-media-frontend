// src/redux/actions/userActions.ts
import axiosInstance from '../../utils/axiosconfig'
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
} from './actionTypes'
import { Dispatch } from 'redux'

// Define User Data Types
interface UserData {
  name: string
  email: string
  password: string
}

interface VerificationData {
  userId: string
  code: string
}

interface OTPData {
  userId: string
}

interface LoginData {
  email: string
  password: string
}

interface EmailData {
  email: string
}

interface ResetData {
  userId: string
  newPassword: string
}

// Define Action Types
interface UserRegisterRequestAction {
  type: typeof USER_REGISTER_REQUEST
}

interface UserRegisterSuccessAction {
  type: typeof USER_REGISTER_SUCCESS
  payload: any // Adjust payload type based on your API response
}

interface UserRegisterFailAction {
  type: typeof USER_REGISTER_FAIL
  payload: string
}

// Combine action types using a union type
type UserActionTypes =
  | UserRegisterRequestAction
  | UserRegisterSuccessAction
  | UserRegisterFailAction

// Register User Action
export const register =
  (userData: UserData) => async (dispatch: Dispatch<UserActionTypes>) => {
    dispatch({ type: USER_REGISTER_REQUEST })

    try {
      const response = await axiosInstance.post(
        'http://localhost:8967/user/register',
        userData
      )

      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: response.data
      })
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload: error.response?.data?.message || 'Failed to register'
      })
      throw error
    }
  }

// Verify User Action
export const verify =
  (verificationData: VerificationData) => async (dispatch: Dispatch) => {
    dispatch({ type: USER_VERIFY_REQUEST })

    try {
      // Implement your verification logic
    } catch (error) {
      // Handle errors
    }
  }

// Send OTP Action
export const sendOTP = (otpData: OTPData) => async (dispatch: Dispatch) => {
  dispatch({ type: USER_SEND_OTP_REQUEST })

  try {
    // Implement send OTP logic
  } catch (error) {
    // Handle errors
  }
}

// Login User Action
export const login = (loginData: LoginData) => async (dispatch: Dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST })

  try {
    // Implement login logic
  } catch (error) {
    // Handle errors
  }
}

// Forgot Password - Send OTP Action
export const forgotSendOTP =
  (emailData: EmailData) => async (dispatch: Dispatch) => {
    dispatch({ type: USER_FORGOT_SEND_OTP_REQUEST })

    try {
      // Implement send OTP for forgot password logic
    } catch (error) {
      // Handle errors
    }
  }

// Forgot Password - Reset Password Action
export const forgotResetPassword =
  (resetData: ResetData) => async (dispatch: Dispatch) => {
    dispatch({ type: USER_RESET_PASSWORD_REQUEST })

    try {
      // Implement reset password logic
    } catch (error) {
      // Handle errors
    }
  }
