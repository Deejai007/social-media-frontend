export interface User {
  username: string
  email: string
  password: string
}

export interface UserState {
  user: any
  loading: boolean
  error: string | null
  successMessage: string | null
}

export interface RegisterSuccessAction {
  type: 'REGISTER_SUCCESS'
  payload: User
}

// Define other action types as needed
export type UserActionTypes = RegisterSuccessAction /* | otherActionTypes */
