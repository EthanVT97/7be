import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Transaction {
  id: number;
  userId: number;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: 'kpay' | 'wavepay' | 'ayapay' | 'cbpay';
  paymentAccount: string;
  paymentAccountName: string;
  transactionRef?: string;
  remark?: string;
  createdAt: string;
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    fetchTransactionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTransactionsSuccess: (state, action: PayloadAction<Transaction[]>) => {
      state.loading = false;
      state.transactions = action.payload;
    },
    fetchTransactionsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createTransactionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createTransactionSuccess: (state, action: PayloadAction<Transaction>) => {
      state.loading = false;
      state.transactions.push(action.payload);
    },
    createTransactionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateTransactionStatus: (state, action: PayloadAction<{ id: number; status: Transaction['status'] }>) => {
      const transaction = state.transactions.find(t => t.id === action.payload.id);
      if (transaction) {
        transaction.status = action.payload.status;
      }
    }
  }
});

export const {
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  createTransactionStart,
  createTransactionSuccess,
  createTransactionFailure,
  updateTransactionStatus
} = transactionSlice.actions;

export default transactionSlice.reducer; 