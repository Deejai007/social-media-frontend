// src/redux/reducers/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./authReducer";
import postReducer from "./postReducer";
import followReducer from "./followReducer";
// import counterReducer from './counterReducer';

const rootReducer = combineReducers({
  user: userReducer,
  post: postReducer,
  follow: followReducer,
});

export default rootReducer;
