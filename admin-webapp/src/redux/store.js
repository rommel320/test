import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import restaurantsReducer from './slices/restaurantsSlice';
import ordersReducer from './slices/ordersSlice';
import ridersReducer from './slices/ridersSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    restaurants: restaurantsReducer,
    orders: ordersReducer,
    riders: ridersReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
