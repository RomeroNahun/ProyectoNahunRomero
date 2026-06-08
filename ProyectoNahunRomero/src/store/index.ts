import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "./slices/userProfileSlice";
import solicitudesReducer from "./slices/solicitudesSlice";
import rutasReducer from "./slices/rutasSlice";

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    solicitudes: solicitudesReducer,
    rutas: rutasReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
