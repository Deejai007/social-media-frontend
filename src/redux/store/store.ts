import { configureStore, Tuple } from '@reduxjs/toolkit'
import rootReducer from '../reducers/index'
import thunk from 'redux-thunk'

const store = configureStore({
  reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store
