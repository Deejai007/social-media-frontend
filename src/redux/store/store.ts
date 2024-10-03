import { configureStore, Tuple } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "../reducers/index";
import { PersistConfig } from "redux-persist";
import thunk from "redux-thunk";

type Roottype = ReturnType<typeof appReducer>;

// Configure persist
const persistConfig: PersistConfig<Roottype> = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, appReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);
export { store, persistor };

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
