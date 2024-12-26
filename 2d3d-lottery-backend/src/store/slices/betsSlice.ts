import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BetsState, Bet } from '../../types';
import { api } from '../../services/api';

const initialState: BetsState = {
  recentBets: [],
  loading: false,
  error: null,
};

export const fetchRecentBets = createAsyncThunk(
  'bets/fetchRecentBets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bets/recent');
      return response.data.bets;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent bets');
    }
  }
);

export const placeBet = createAsyncThunk(
  'bets/placeBet',
  async (bet: { type: '2D' | '3D'; number: string; amount: number }, { rejectWithValue }) => {
    try {
      const response = await api.post('/bets/place', bet);
      return response.data.bet;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to place bet');
    }
  }
);

const betsSlice = createSlice({
  name: 'bets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Recent Bets
    builder
      .addCase(fetchRecentBets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentBets.fulfilled, (state, action) => {
        state.loading = false;
        state.recentBets = action.payload;
      })
      .addCase(fetchRecentBets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Place Bet
    builder
      .addCase(placeBet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeBet.fulfilled, (state, action) => {
        state.loading = false;
        state.recentBets = [action.payload, ...state.recentBets].slice(0, 10); // Keep only 10 most recent bets
      })
      .addCase(placeBet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default betsSlice.reducer; 