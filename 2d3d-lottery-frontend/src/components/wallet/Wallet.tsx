import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../store';
import { fetchBalance, deposit, withdraw } from '../../store/slices/walletSlice';
import { fetchTransactions } from '../../store/slices/transactionsSlice';
import { WalletContainer } from '../common/GlassContainer';
import { Button } from '../common/Button';

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  text-shadow: ${({ theme }) => theme.shadows.glow};
`;

const BalanceCard = styled(WalletContainer)`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const BalanceLabel = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const BalanceAmount = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  padding: ${({ theme }) => theme.spacing.md};
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  .details {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    
    .type {
      color: ${({ theme }) => theme.colors.text.primary};
      font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    }
    
    .date {
      color: ${({ theme }) => theme.colors.text.secondary};
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
    }
  }
  
  .amount {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    &.positive {
      color: ${({ theme }) => theme.colors.success};
    }
    &.negative {
      color: ${({ theme }) => theme.colors.error};
    }
  }
`;

const Wallet: React.FC = () => {
  const [mode, setMode] = useState<'deposit' | 'withdraw' | null>(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const { balance, loading: walletLoading } = useSelector((state: RootState) => state.wallet);
  const { transactions, loading: transactionsLoading } = useSelector((state: RootState) => state.transactions);

  useEffect(() => {
    dispatch(fetchBalance());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Only allow numbers
      setAmount(value);
      setError('');
    }
  };

  const validateAmount = (): boolean => {
    const value = parseInt(amount);
    if (!amount || isNaN(value) || value < 1000) {
      setError('အနည်းဆုံး ၁,၀၀၀ ကျပ် ဖြစ်ရပါမည်');
      return false;
    }

    if (mode === 'withdraw' && value > balance) {
      setError('လက်ကျန်ငွေ မလုံလောက်ပါ');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAmount()) return;

    try {
      if (mode === 'deposit') {
        await dispatch(deposit(parseInt(amount))).unwrap();
      } else if (mode === 'withdraw') {
        await dispatch(withdraw(parseInt(amount))).unwrap();
      }
      
      // Reset form after successful transaction
      setMode(null);
      setAmount('');
    } catch (err) {
      setError('ငွေသွင်း/ထုတ်ရာတွင် အမှားရှိနေပါသည်');
    }
  };

  return (
    <div>
      <Title>ပိုက်ဆံအိတ်</Title>

      <BalanceCard>
        <BalanceLabel>လက်ကျန်ငွေ</BalanceLabel>
        <BalanceAmount>{balance.toLocaleString()} ကျပ်</BalanceAmount>
        <ActionButtons>
          <Button
            variant="gradient"
            onClick={() => setMode('deposit')}
            disabled={mode === 'deposit'}
          >
            ငွေသွင်းမည်
          </Button>
          <Button
            variant="outline"
            onClick={() => setMode('withdraw')}
            disabled={mode === 'withdraw'}
          >
            ငွေထုတ်မည်
          </Button>
        </ActionButtons>
      </BalanceCard>

      {mode && (
        <Section>
          <SectionTitle>
            {mode === 'deposit' ? 'ငွေသွင်းရ��်' : 'ငွေထုတ်ရန်'}
          </SectionTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>ငွေပမာဏ</Label>
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="ငွေပမာဏ ထည့်သွင်းပါ"
                disabled={walletLoading}
              />
            </FormGroup>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Button
              type="submit"
              variant="gradient"
              disabled={walletLoading}
              fullWidth
            >
              {walletLoading
                ? mode === 'deposit'
                  ? 'ငွေသွင်းနေသည်...'
                  : 'ငွေထုတ်နေသည်...'
                : mode === 'deposit'
                ? 'သွင်းမည်'
                : 'ထုတ်မည်'}
            </Button>
          </Form>
        </Section>
      )}

      <Section>
        <SectionTitle>ငွေသွင်း/ထုတ်မှတ်တမ်း</SectionTitle>
        <TransactionList>
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id}>
              <div className="details">
                <span className="type">
                  {transaction.type === 'DEPOSIT' ? 'ငွေသွင်း' : 'ငွေထုတ်'}
                </span>
                <span className="date">
                  {new Date(transaction.createdAt).toLocaleDateString('my-MM')}
                </span>
              </div>
              <span className={`amount ${transaction.type === 'DEPOSIT' ? 'positive' : 'negative'}`}>
                {transaction.type === 'DEPOSIT' ? '+' : '-'}
                {transaction.amount.toLocaleString()} ကျပ်
              </span>
            </TransactionItem>
          ))}
        </TransactionList>
      </Section>
    </div>
  );
};

export default Wallet; 