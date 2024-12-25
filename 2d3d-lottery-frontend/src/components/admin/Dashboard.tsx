import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchAdminStats } from '../../store/slices/adminSlice';

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const StatValue = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Td = styled.td`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Status = styled.span<{ status: string }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme, status }) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning + '20';
      case 'completed':
        return theme.colors.success + '20';
      case 'rejected':
        return theme.colors.error + '20';
      default:
        return theme.colors.text.secondary + '20';
    }
  }};
  color: ${({ theme, status }) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'completed':
        return theme.colors.success;
      case 'rejected':
        return theme.colors.error;
      default:
        return theme.colors.text.secondary;
    }
  }};
`;

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title>ထိန်းချုပ်ခန်း</Title>

      <StatsGrid>
        <StatCard>
          <StatLabel>စုစုပေါင်း အသုံးပြုသူ</StatLabel>
          <StatValue>{stats.totalUsers.toLocaleString()}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>ယနေ့ ထီထိုးမှတ်တမ်း</StatLabel>
          <StatValue>{stats.todayBets.toLocaleString()}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>ယနေ့ ဝင်ငွေ</StatLabel>
          <StatValue>{stats.todayRevenue.toLocaleString()}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>စုစုပေါင်း ဝင်ငွေ</StatLabel>
          <StatValue>{stats.totalRevenue.toLocaleString()}</StatValue>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionTitle>နောက်ဆုံး ထီထိုးမှတ်တမ်းများ</SectionTitle>
        <Table>
          <thead>
            <tr>
              <Th>အသုံးပြုသူ</Th>
              <Th>အမျိုးအစား</Th>
              <Th>ဂဏန်း</Th>
              <Th>ပမာဏ</Th>
              <Th>အခြေအနေ</Th>
              <Th>ရက်စွဲ</Th>
            </tr>
          </thead>
          <tbody>
            {stats.recentBets.map((bet) => (
              <tr key={bet.id}>
                <Td>{bet.username}</Td>
                <Td>{bet.type}</Td>
                <Td>{bet.number}</Td>
                <Td>{bet.amount.toLocaleString()}</Td>
                <Td>
                  <Status status={bet.status}>
                    {bet.status === 'pending' && 'စောင့်ဆိုင်းဆဲ'}
                    {bet.status === 'won' && 'အနိုင်ရ'}
                    {bet.status === 'lost' && 'အရှုံး'}
                  </Status>
                </Td>
                <Td>{new Date(bet.createdAt).toLocaleDateString()}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section>
        <SectionTitle>နောက်ဆုံး ငွေသွင်း/ထုတ် မှတ်တမ်းများ</SectionTitle>
        <Table>
          <thead>
            <tr>
              <Th>အသုံးပြုသူ</Th>
              <Th>အမျိုးအစား</Th>
              <Th>ပမာဏ</Th>
              <Th>အချေအနေ</Th>
              <Th>ရက်စွဲ</Th>
            </tr>
          </thead>
          <tbody>
            {stats.recentTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <Td>{transaction.username}</Td>
                <Td>{transaction.type === 'deposit' ? 'ငွေသွင်း' : 'ငွေထုတ်'}</Td>
                <Td>{transaction.amount.toLocaleString()}</Td>
                <Td>
                  <Status status={transaction.status}>
                    {transaction.status === 'pending' && 'စောင့်ဆိုင်းဆဲ'}
                    {transaction.status === 'completed' && 'ပြီးဆုံး'}
                    {transaction.status === 'rejected' && 'ငြင်းပယ်'}
                  </Status>
                </Td>
                <Td>{new Date(transaction.createdAt).toLocaleDateString()}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
    </div>
  );
};

export default Dashboard; 