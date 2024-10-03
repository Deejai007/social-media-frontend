// src/redux/reducers/appReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./authReducer";
import postReducer from "./postReducer";
import followReducer from "./followReducer";

// Root reducer
const appReducer = combineReducers({
  user: userReducer,
  post: postReducer,
  follow: followReducer,
});

// Create a root reducer with logout handling
const rootReducer = (state: any, action: any) => {
  if (action.type === "LOGOUT") {
    // Reset all states when user logs out
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
