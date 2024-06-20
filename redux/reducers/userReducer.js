import { combineReducers } from 'redux'
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
} from '../actions/types'

const initialState = {
  user: null,
  loading: false,
  error: null
}

const userRegisterReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { ...state, loading: true }
    case USER_REGISTER_SUCCESS:
      return { ...state, loading: false, user: action.payload }
    case USER_REGISTER_FAIL:
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const userVerifyReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_VERIFY_REQUEST:
      return { ...state, loading: true }
    case USER_VERIFY_SUCCESS:
      return { ...state, loading: false, user: action.payload }
    case USER_VERIFY_FAIL:
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const userSendOTPReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_SEND_OTP_REQUEST:
      return { ...state, loading: true }
    case USER_SEND_OTP_SUCCESS:
      return { ...state, loading: false, user: action.payload }
    case USER_SEND_OTP_FAIL:
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const userLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true }
    case USER_LOGIN_SUCCESS:
      return { ...state, loading: false, user: action.payload }
    case USER_LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const userForgotSendOTPReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_FORGOT_SEND_OTP_REQUEST:
      return { ...state, loading: true }
    case USER_FORGOT_SEND_OTP_SUCCESS:
      return { ...state, loading: false, user: action.payload }
    case USER_FORGOT_SEND_OTP_FAIL:
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const userResetPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_RESET_PASSWORD_REQUEST:
      return { ...state, loading: true }
    case USER_RESET_PASSWORD_SUCCESS:
      return { ...state, loading: false, user: action.payload }
    case USER_RESET_PASSWORD_FAIL:
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const userReducer = combineReducers({
  register: userRegisterReducer,
  verify: userVerifyReducer,
  sendOTP: userSendOTPReducer,
  login: userLoginReducer,
  forgotSendOTP: userForgotSendOTPReducer,
  resetPassword: userResetPasswordReducer
})

export default userReducer
