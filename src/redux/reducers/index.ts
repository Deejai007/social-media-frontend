// reducers/index.ts
import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './userReducer'
// import postReducer from './postReducer';

const rootReducer = combineReducers({
  user: userReducer
  // posts: postReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
