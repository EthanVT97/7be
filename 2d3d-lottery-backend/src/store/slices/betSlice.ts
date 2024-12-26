import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Bet {
  id: number;
  userId: number;
  lotteryNumberId: number;
  amount: number;
  status: 'pending' | 'won' | 'lost';
  createdAt: string;
}

interface BetState {
  bets: Bet[];
  loading: boolean;
  error: string | null;
}

const initialState: BetState = {
  bets: [],
  loading: false,
  error: null
};

const betSlice = createSlice({
  name: 'bet',
  initialState,
  reducers: {
    fetchBetsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBetsSuccess: (state, action: PayloadAction<Bet[]>) => {
      state.loading = false;
      state.bets = action.payload;
    },
    fetchBetsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    placeBetStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    placeBetSuccess: (state, action: PayloadAction<Bet>) => {
      state.loading = false;
      state.bets.push(action.payload);
    },
    placeBetFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateBetStatus: (state, action: PayloadAction<{ id: number; status: Bet['status'] }>) => {
      const bet = state.bets.find(b => b.id === action.payload.id);
      if (bet) {
        bet.status = action.payload.status;
      }
    }
  }
});

export const {
  fetchBetsStart,
  fetchBetsSuccess,
  fetchBetsFailure,
  placeBetStart,
  placeBetSuccess,
  placeBetFailure,
  updateBetStatus
} = betSlice.actions;

export default betSlice.reducer; 