// export interface User {
//   username: string
//   email: string
//   password: string
// }

export interface User {
  about: string | null;
  firstName: string | null;
  id: number | null;
  lastName: string | null;
  profileImage: string | null;
  updatedAt: string | null;
  email: string | null;
  createdAt: string | null;
  username: string | null;
  verified: boolean;
  location: string | null;
}

export interface UserState {
  user: any;
  isFollowing: boolean | false;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface RegisterSuccessAction {
  type: "REGISTER_SUCCESS";
  payload: User;
}

// Define other action types as needed
export type UserActionTypes = RegisterSuccessAction; /* | otherActionTypes */
