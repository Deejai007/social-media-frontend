// import { configureStore } from '@reduxjs/toolkit'
// import type { TypedUseSelectorHook } from 'react-redux'
// import { useDispatch, useSelector } from 'react-redux'

// // Import Reducers
// import authReducer from '../reducers/authReducer'

// const store = configureStore({
//   reducer: {
//     auth: authReducer
//   }
// })

// // Declare Typed Definitions
// type RootState = ReturnType<typeof store.getState>
// type AppDispatch = typeof store.dispatch

// export const useAppDispatch: () => AppDispatch = useDispatch
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// export default store
// src/redux/store.ts
import { configureStore, Tuple } from '@reduxjs/toolkit'
import rootReducer from '../reducers/index'
import thunk from 'redux-thunk'

const store = configureStore({
  reducer: rootReducer
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
  // middleware: () => new Tuple(additionalMiddleware, logger)
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store
