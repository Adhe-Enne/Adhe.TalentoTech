import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../api/productApi';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const idx = state.items.findIndex((i) => String(i.product.id) === String(product.id));
      if (idx >= 0) {
        state.items[idx].quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },
    removeFromCart: (state, action: PayloadAction<{ productId: number | string }>) => {
      state.items = state.items.filter((i) => String(i.product.id) !== String(action.payload.productId));
    },
    updateQuantity: (state, action: PayloadAction<{ productId: number | string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const idx = state.items.findIndex((i) => String(i.product.id) === String(productId));
      if (idx >= 0) {
        if (quantity <= 0) state.items.splice(idx, 1);
        else state.items[idx].quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCart = (state: { cart: CartState }) => state.cart;
