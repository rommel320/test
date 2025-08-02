import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import deliverySlice from './slices/deliverySlice';
import locationSlice from './slices/locationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    deliveries: deliverySlice,
    location: locationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
