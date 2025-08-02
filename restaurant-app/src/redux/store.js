import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import orderSlice from './slices/orderSlice';
import menuSlice from './slices/menuSlice';
import dashboardSlice from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    orders: orderSlice,
    menu: menuSlice,
    dashboard: dashboardSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
