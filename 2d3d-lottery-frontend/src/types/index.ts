export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Bet {
  id: string;
  userId: string;
  type: '2D' | '3D';
  number: string;
  amount: number;
  status: 'PENDING' | 'WON' | 'LOST';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'WIN' | 'BET';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface WalletState {
  balance: number;
  loading: boolean;
  error: string | null;
}

export interface BetsState {
  recentBets: Bet[];
  loading: boolean;
  error: string | null;
}

export interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
} 