import { combineReducers } from 'redux'
import userReducer from './userReducer'

// Add other reducers as needed
const rootReducer = combineReducers({
  user: userReducer
  // Add more reducers here
})

export default rootReducer
