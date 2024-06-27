// src/redux/reducers/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './authReducer'
// import counterReducer from './counterReducer';

const rootReducer = combineReducers({
  user: userReducer
})

export default rootReducer
