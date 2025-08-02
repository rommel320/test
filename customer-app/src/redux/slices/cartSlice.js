import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  restaurantId: null,
  restaurantName: '',
  subtotal: 0,
  deliveryFee: 0,
  tax: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { item, restaurantId, restaurantName } = action.payload;
      
      // If adding from different restaurant, clear cart
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
      }
      
      state.restaurantId = restaurantId;
      state.restaurantName = restaurantName;
      
      const existingItem = state.items.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...item,
          quantity: 1,
        });
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = '';
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== itemId);
        } else {
          item.quantity = quantity;
        }
      }
      
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = '';
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = '';
      state.subtotal = 0;
      state.deliveryFee = 0;
      state.tax = 0;
      state.total = 0;
    },
    
    setDeliveryFee: (state, action) => {
      state.deliveryFee = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    calculateTotals: (state) => {
      state.subtotal = state.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      state.tax = state.subtotal * 0.08; // 8% tax
      state.total = state.subtotal + state.deliveryFee + state.tax;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setDeliveryFee,
} = cartSlice.actions;

export default cartSlice.reducer;
