import { combineReducers } from 'redux'

export interface AuthState {
  loading: boolean
  user: any | null
  error: string | null
}

const initialState: AuthState = {
  loading: false,
  user: null,
  error: null
}

const userRegisterReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case 'USER_REGISTER_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      }
    case 'USER_REGISTER_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null
      }
    case 'USER_REGISTER_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    default:
      return state
  }
}
const userVerifyReducer = (
  state: AuthState = initialState,
  action: any
): AuthState => {
  switch (action.type) {
    case 'USER_VERIFY_REQUEST':
      return { ...state, loading: true }
    case 'USER_VERIFY_SUCCESS':
      return { ...state, loading: false, user: action.payload }
    case 'USER_VERIFY_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const userSendOTPReducer = (
  state: AuthState = initialState,
  action: any
): AuthState => {
  switch (action.type) {
    case 'USER_SEND_OTP_REQUEST':
      return { ...state, loading: true }
    case 'USER_SEND_OTP_SUCCESS':
      return { ...state, loading: false, user: action.payload }
    case 'USER_SEND_OTP_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const userLoginReducer = (
  state: AuthState = initialState,
  action: any
): AuthState => {
  switch (action.type) {
    case 'USER_LOGIN_REQUEST':
      return { ...state, loading: true }
    case 'USER_LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload }
    case 'USER_LOGIN_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const userForgotSendOTPReducer = (
  state: AuthState = initialState,
  action: any
): AuthState => {
  switch (action.type) {
    case 'USER_FORGOT_SEND_OTP_REQUEST':
      return { ...state, loading: true }
    case 'USER_FORGOT_SEND_OTP_SUCCESS':
      return { ...state, loading: false, user: action.payload }
    case 'USER_FORGOT_SEND_OTP_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const userResetPasswordReducer = (
  state: AuthState = initialState,
  action: any
): AuthState => {
  switch (action.type) {
    case 'USER_RESET_PASSWORD_REQUEST':
      return { ...state, loading: true }
    case 'USER_RESET_PASSWORD_SUCCESS':
      return { ...state, loading: false, user: action.payload }
    case 'USER_RESET_PASSWORD_FAIL':
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
