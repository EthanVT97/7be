export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    phone: string;
    balance: number;
  };
}

export interface BetHistoryItem {
  id: number;
  type: '2D' | '3D';
  numbers: string[];
  amounts: number[];
  totalAmount: number;
  status: 'pending' | 'won' | 'lost';
  createdAt: string;
  result?: string;
  winAmount?: number;
}

export interface BetHistoryResponse {
  items: BetHistoryItem[];
  total: number;
  page: number;
  limit: number;
}

export interface GameStatus {
  isOpen: boolean;
  nextDrawTime: string;
  lastResult?: string;
  closesIn: number; // minutes
}

export interface TransactionResponse {
  id: number;
  type: 'deposit' | 'withdraw';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  transactionId?: string;
  accountInfo?: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
} 