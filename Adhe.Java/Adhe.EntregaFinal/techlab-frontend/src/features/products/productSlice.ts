import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getProducts, updateProduct as apiUpdateProduct, type Product } from '../../api/productApi';

export interface ProductsState {
  items: Product[];
  loading: boolean;
  error?: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const products = await getProducts();
  return products;
});

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, changes }: { id: number | string; changes: Partial<Product> }) => {
    const updated = await apiUpdateProduct(id, changes);
    if (!updated) throw new Error('Failed to update product');
    return updated;
  },
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message ?? 'Failed to load products';
    });
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
      state.loading = false;
      const idx = state.items.findIndex((i) => String(i.id) === String(action.payload.id));
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.unshift(action.payload);
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message ?? 'Failed to update product';
    });
  },
});

export default productsSlice.reducer;
