import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getTransactions, updateTransactionStatus } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../hooks/useConfirm';

interface Transaction {
  id: string;
  userId: string;
  username: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  accountInfo?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #212529;
`;

const Button = styled.button<{ variant?: 'success' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${props => 
    props.variant === 'success' ? '#28a745' : 
    props.variant === 'danger' ? '#dc3545' : 
    '#007bff'};
  color: white;
  transition: opacity 0.2s;
  margin-right: 0.5rem;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Status = styled.span<{ status: 'pending' | 'completed' | 'rejected' }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: ${props => {
    switch (props.status) {
      case 'completed':
        return '#d4edda';
      case 'rejected':
        return '#f8d7da';
      default:
        return '#fff3cd';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'completed':
        return '#155724';
      case 'rejected':
        return '#721c24';
      default:
        return '#856404';
    }
  }};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: white;
  color: #495057;

  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  width: 300px;

  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
`;

const NoData = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
`;

const AccountInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6c757d;
`;

const TransactionManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'deposit' | 'withdraw'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all');
  
  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();
      setTransactions(response.data);
    } catch (error) {
      toast.showToast('Failed to fetch transactions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (transactionId: string, newStatus: 'completed' | 'rejected') => {
    const confirmed = await confirm({
      title: `${newStatus === 'completed' ? 'Approve' : 'Reject'} Transaction`,
      message: `Are you sure you want to ${newStatus === 'completed' ? 'approve' : 'reject'} this transaction?`,
      confirmText: 'Yes',
      cancelText: 'No',
      type: newStatus === 'completed' ? 'warning' : 'danger'
    });

    if (!confirmed) return;

    try {
      await updateTransactionStatus(transactionId, newStatus);
      setTransactions(transactions.map(transaction => 
        transaction.id === transactionId ? { ...transaction, status: newStatus } : transaction
      ));
      toast.showToast('Transaction status updated successfully', 'success');
    } catch (error) {
      toast.showToast('Failed to update transaction status', 'error');
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="Search by username or transaction ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as 'all' | 'deposit' | 'withdraw')}
        >
          <option value="all">All Types</option>
          <option value="deposit">Deposits</option>
          <option value="withdraw">Withdrawals</option>
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'completed' | 'rejected')}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </Select>
      </FilterContainer>

      <Table>
        <thead>
          <tr>
            <Th>Username</Th>
            <Th>Type</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
            <Th>Details</Th>
            <Th>Created At</Th>
            <Th>Updated At</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(transaction => (
              <tr key={transaction.id}>
                <Td>{transaction.username}</Td>
                <Td>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</Td>
                <Td>{transaction.amount.toLocaleString()}</Td>
                <Td>
                  <Status status={transaction.status}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Status>
                </Td>
                <Td>
                  {transaction.type === 'deposit' && transaction.transactionId && (
                    <>Transaction ID: {transaction.transactionId}</>
                  )}
                  {transaction.type === 'withdraw' && transaction.accountInfo && (
                    <AccountInfo>
                      {JSON.parse(transaction.accountInfo).bankName} - {JSON.parse(transaction.accountInfo).accountNumber}
                    </AccountInfo>
                  )}
                </Td>
                <Td>{new Date(transaction.createdAt).toLocaleString()}</Td>
                <Td>{new Date(transaction.updatedAt).toLocaleString()}</Td>
                <Td>
                  {transaction.status === 'pending' && (
                    <>
                      <Button
                        variant="success"
                        onClick={() => handleStatusChange(transaction.id, 'completed')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleStatusChange(transaction.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <Td colSpan={8}>
                <NoData>
                  {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                    ? 'No transactions found matching your filters'
                    : 'No transactions found'}
                </NoData>
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TransactionManagement; 