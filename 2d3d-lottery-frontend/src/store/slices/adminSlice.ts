import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface AdminSettings {
  minBetAmount: number;
  minDepositAmount: number;
  maxWithdrawAmount: number;
  twoDCloseTime: number;
  threeDCloseTime: number;
}

interface AdminState {
  settings: AdminSettings;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  settings: {
    minBetAmount: 100,
    minDepositAmount: 1000,
    maxWithdrawAmount: 1000000,
    twoDCloseTime: 30,
    threeDCloseTime: 60,
  },
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk(
  'admin/fetchSettings',
  async () => {
    const response = await api.get('/api/admin/settings');
    return response.data;
  }
);

export const updateSettings = createAsyncThunk(
  'admin/updateSettings',
  async (settings: AdminSettings) => {
    const response = await api.put('/api/admin/settings', settings);
    return response.data;
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch settings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'ဆက်တင်များ ရယူရာတွင် အမှားရှိနေပါသည်';
      })
      // Update settings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'ဆက်တင်များ ပြောင်းလဲရာတွင် အမှားရှိနေပါသည်';
      });
  },
});

export default adminSlice.reducer; 