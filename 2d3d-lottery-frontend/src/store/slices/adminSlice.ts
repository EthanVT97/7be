import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface AdminState {
  stats: any;
  settings: any;
  bets: any[];
  transactions: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  settings: null,
  bets: [],
  transactions: [],
  loading: false,
  error: null,
};

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  }
);

export const fetchSettings = createAsyncThunk(
  'admin/fetchSettings',
  async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  }
);

export const updateSettings = createAsyncThunk(
  'admin/updateSettings',
  async (settings: any) => {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  }
);

export const fetchBets = createAsyncThunk(
  'admin/fetchBets',
  async () => {
    const response = await api.get('/admin/bets');
    return response.data;
  }
);

export const updateBetStatus = createAsyncThunk(
  'admin/updateBetStatus',
  async ({ betId, status }: { betId: string; status: string }) => {
    const response = await api.put(`/admin/bets/${betId}`, { status });
    return response.data;
  }
);

export const fetchTransactions = createAsyncThunk(
  'admin/fetchTransactions',
  async () => {
    const response = await api.get('/admin/transactions');
    return response.data;
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stats';
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(fetchBets.fulfilled, (state, action) => {
        state.bets = action.payload;
      })
      .addCase(updateBetStatus.fulfilled, (state, action) => {
        const index = state.bets.findIndex(bet => bet.id === action.payload.id);
        if (index !== -1) {
          state.bets[index] = action.payload;
        }
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
      });
  },
});

export default adminSlice.reducer; 