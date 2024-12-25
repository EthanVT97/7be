import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WalletState } from '../../types';
import { api } from '../../services/api';

const initialState: WalletState = {
  balance: 0,
  loading: false,
  error: null,
};

export const fetchBalance = createAsyncThunk(
  'wallet/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wallet/balance');
      return response.data.balance;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch balance');
    }
  }
);

export const deposit = createAsyncThunk(
  'wallet/deposit',
  async (amount: number, { rejectWithValue }) => {
    try {
      const response = await api.post('/wallet/deposit', { amount });
      return response.data.balance;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deposit');
    }
  }
);

export const withdraw = createAsyncThunk(
  'wallet/withdraw',
  async (amount: number, { rejectWithValue }) => {
    try {
      const response = await api.post('/wallet/withdraw', { amount });
      return response.data.balance;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to withdraw');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Balance
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Deposit
    builder
      .addCase(deposit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deposit.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(deposit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Withdraw
    builder
      .addCase(withdraw.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(withdraw.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default walletSlice.reducer; 