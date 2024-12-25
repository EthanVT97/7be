import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchTransactions, updateTransactionStatus } from '../../store/slices/adminSlice';
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

interface Transaction {
  id: string;
  username: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
}

const TransactionManagement: React.FC = () => {
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    date: '',
  });
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchTransactions({ page, ...filters }));
  }, [dispatch, page, filters]);

  const handleStatusChange = async (transactionId: string, status: string) => {
    try {
      await dispatch(updateTransactionStatus({ transactionId, status })).unwrap();
      dispatch(fetchTransactions({ page, ...filters }));
    } catch (err) {
      console.error('Failed to update transaction status:', err);
    }
  };

  return (
    <div>
      <Title>ငွေသွင်း/ထုတ် မှတ်တမ်းများ စီမံခန့်ခွဲခြင်း</Title>

      <Filters>
        <Select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="all">အားလုံး</option>
          <option value="deposit">ငွေသွင်း</option>
          <option value="withdraw">ငွေထုတ်</option>
        </Select>

        <Select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">အားလုံး</option>
          <option value="pending">စောင့်ဆိုင်းဆဲ</option>
          <option value="completed">ပြီးဆုံး</option>
          <option value="rejected">ငြင်းပယ်</option>
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
            <Th>ပမာဏ</Th>
            <Th>အခြေအနေ</Th>
            <Th>ရက်စွဲ</Th>
            <Th>လုပ်ဆောင်ချက်</Th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction: Transaction) => (
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
              <Td>
                {transaction.status === 'pending' && (
                  <>
                    <ActionButton
                      variant="success"
                      onClick={() => handleStatusChange(transaction.id, 'completed')}
                      disabled={loading}
                    >
                      အတည်ပြု
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={() => handleStatusChange(transaction.id, 'rejected')}
                      disabled={loading}
                      style={{ marginLeft: '8px' }}
                    >
                      ငြင်းပယ်
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
          disabled={transactions.length < 10 || loading}
        >
          နောက်
        </Button>
      </Pagination>
    </div>
  );
};

export default TransactionManagement; 