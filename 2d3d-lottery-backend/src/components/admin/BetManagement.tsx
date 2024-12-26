import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchBets, updateBetStatus } from '../../store/slices/adminSlice';
import { Button } from '../common/Button';

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Filters = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Select = styled.select`
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
`;

const DateInput = styled.input`
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
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const Th = styled.th`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
`;

const Td = styled.td`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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
      case 'won':
        return theme.colors.success + '20';
      case 'lost':
        return theme.colors.error + '20';
      default:
        return theme.colors.text.secondary + '20';
    }
  }};
  color: ${({ theme, status }) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'won':
        return theme.colors.success;
      case 'lost':
        return theme.colors.error;
      default:
        return theme.colors.text.secondary;
    }
  }};
`;

const ActionButton = styled(Button)`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

interface Bet {
  id: string;
  username: string;
  type: '2D' | '3D';
  number: string;
  amount: number;
  status: 'pending' | 'won' | 'lost';
  createdAt: string;
}

const BetManagement: React.FC = () => {
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    date: '',
  });
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { bets, loading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchBets({ page, ...filters }));
  }, [dispatch, page, filters]);

  const handleStatusChange = async (betId: string, status: string) => {
    try {
      await dispatch(updateBetStatus({ betId, status })).unwrap();
      dispatch(fetchBets({ page, ...filters }));
    } catch (err) {
      console.error('Failed to update bet status:', err);
    }
  };

  return (
    <div>
      <Title>ထီထိုးမှတ်တမ်းများ စီမံခန့်ခွဲခြင်း</Title>

      <Filters>
        <Select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="all">အားလုံး</option>
          <option value="2D">၂လုံး</option>
          <option value="3D">၃လုံး</option>
        </Select>

        <Select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">အားလုံး</option>
          <option value="pending">စောင့်ဆိုင်းဆဲ</option>
          <option value="won">အနိုင်ရ</option>
          <option value="lost">အရှုံး</option>
        </Select>

        <DateInput
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
      </Filters>

      <Table>
        <thead>
          <tr>
            <Th>အသုံးပြုသူ</Th>
            <Th>အမျိုးအစား</Th>
            <Th>ဂဏန်း</Th>
            <Th>ပမာဏ</Th>
            <Th>အခြေအနေ</Th>
            <Th>ရက်စွဲ</Th>
            <Th>လုပ်ဆောင်ချက်</Th>
          </tr>
        </thead>
        <tbody>
          {bets.map((bet: Bet) => (
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
              <Td>
                {bet.status === 'pending' && (
                  <>
                    <ActionButton
                      variant="success"
                      onClick={() => handleStatusChange(bet.id, 'won')}
                      disabled={loading}
                    >
                      အနိုင်
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={() => handleStatusChange(bet.id, 'lost')}
                      disabled={loading}
                      style={{ marginLeft: '8px' }}
                    >
                      အရှုံး
                    </ActionButton>
                  </>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Button
          variant="outline"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          ရှေ့
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage(p => p + 1)}
          disabled={bets.length < 10 || loading}
        >
          နောက်
        </Button>
      </Pagination>
    </div>
  );
};

export default BetManagement; 