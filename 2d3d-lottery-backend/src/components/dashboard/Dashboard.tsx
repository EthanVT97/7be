import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../../store';
import { DashboardContainer } from '../common/GlassContainer';
import { Button } from '../common/Button';

const BalanceSection = styled(DashboardContainer)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BalanceInfo = styled.div`
  text-align: left;
`;

const BalanceLabel = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const BalanceAmount = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const ShortcutsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ShortcutCard = styled(DashboardContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  
  h3 {
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const HistorySection = styled(DashboardContainer)`
  h2 {
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const HistoryItem = styled.div`
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

const Dashboard: React.FC = () => {
  const { balance } = useSelector((state: RootState) => state.wallet);
  const { recentBets } = useSelector((state: RootState) => state.bets);
  const { transactions } = useSelector((state: RootState) => state.transactions);

  return (
    <div>
      <BalanceSection>
        <BalanceInfo>
          <BalanceLabel>လက်ကျန်ငွေ</BalanceLabel>
          <BalanceAmount>{balance.toLocaleString()} ကျပ်</BalanceAmount>
        </BalanceInfo>
        <Button variant="gradient" as={Link} to="/wallet">
          ငွေဖြည့်မည်
        </Button>
      </BalanceSection>

      <ShortcutsGrid>
        <ShortcutCard>
          <h3>၂လုံး</h3>
          <p>နေ့စဉ် မနက် ၁၁:၀၀ နှင့် ညနေ ၄:၃၀</p>
          <Button variant="primary" as={Link} to="/2d">
            ထိုးမည်
          </Button>
        </ShortcutCard>
        
        <ShortcutCard>
          <h3>၃လုံး</h3>
          <p>လစဉ် ၁ရက်၊ ၁၆ရက်</p>
          <Button variant="primary" as={Link} to="/3d">
            ထိုးမည်
          </Button>
        </ShortcutCard>
      </ShortcutsGrid>

      <HistorySection>
        <h2>နောက်ဆုံးထိုးထားသောထီများ</h2>
        <HistoryList>
          {recentBets.map((bet) => (
            <HistoryItem key={bet.id}>
              <div className="details">
                <span className="type">{bet.type === '2D' ? '၂လုံး' : '၃လုံး'} - {bet.number}</span>
                <span className="date">{new Date(bet.createdAt).toLocaleDateString('my-MM')}</span>
              </div>
              <span className="amount negative">-{bet.amount.toLocaleString()} ကျပ်</span>
            </HistoryItem>
          ))}
        </HistoryList>
      </HistorySection>

      <HistorySection>
        <h2>ငွေသွင်း/ထုတ်မှတ်တမ်း</h2>
        <HistoryList>
          {transactions.map((transaction) => (
            <HistoryItem key={transaction.id}>
              <div className="details">
                <span className="type">
                  {transaction.type === 'DEPOSIT' ? 'ငွေ��ွင်း' : 'ငွေထုတ်'}
                </span>
                <span className="date">
                  {new Date(transaction.createdAt).toLocaleDateString('my-MM')}
                </span>
              </div>
              <span className={`amount ${transaction.type === 'DEPOSIT' ? 'positive' : 'negative'}`}>
                {transaction.type === 'DEPOSIT' ? '+' : '-'}
                {transaction.amount.toLocaleString()} ကျပ်
              </span>
            </HistoryItem>
          ))}
        </HistoryList>
      </HistorySection>
    </div>
  );
};

export default Dashboard; 