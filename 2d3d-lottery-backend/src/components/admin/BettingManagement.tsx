import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getBets, updateBetStatus } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../hooks/useConfirm';

interface Bet {
  id: string;
  userId: string;
  username: string;
  type: '2D' | '3D';
  numbers: string;
  amount: number;
  status: 'pending' | 'won' | 'lost';
  createdAt: string;
  drawTime: string;
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

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Status = styled.span<{ status: 'pending' | 'won' | 'lost' }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: ${props => {
    switch (props.status) {
      case 'won':
        return '#d4edda';
      case 'lost':
        return '#f8d7da';
      default:
        return '#fff3cd';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'won':
        return '#155724';
      case 'lost':
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

const BettingManagement: React.FC = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | '2D' | '3D'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'won' | 'lost'>('all');
  
  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    fetchBets();
  }, []);

  const fetchBets = async () => {
    try {
      const response = await getBets();
      setBets(response.data);
    } catch (error) {
      toast.showToast('Failed to fetch bets', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (betId: string, newStatus: 'won' | 'lost') => {
    const confirmed = await confirm({
      title: 'Update Bet Status',
      message: `Are you sure you want to mark this bet as ${newStatus}?`,
      confirmText: 'Yes',
      cancelText: 'No',
      type: newStatus === 'won' ? 'warning' : 'danger'
    });

    if (!confirmed) return;

    try {
      await updateBetStatus(betId, newStatus);
      setBets(bets.map(bet => 
        bet.id === betId ? { ...bet, status: newStatus } : bet
      ));
      toast.showToast('Bet status updated successfully', 'success');
    } catch (error) {
      toast.showToast('Failed to update bet status', 'error');
    }
  };

  const filteredBets = bets.filter(bet => {
    const matchesSearch = 
      bet.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bet.numbers.includes(searchTerm);
    
    const matchesType = typeFilter === 'all' || bet.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || bet.status === statusFilter;

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
          placeholder="Search by username or numbers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as 'all' | '2D' | '3D')}
        >
          <option value="all">All Types</option>
          <option value="2D">2D</option>
          <option value="3D">3D</option>
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'won' | 'lost')}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </Select>
      </FilterContainer>

      <Table>
        <thead>
          <tr>
            <Th>Username</Th>
            <Th>Type</Th>
            <Th>Numbers</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
            <Th>Draw Time</Th>
            <Th>Placed At</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filteredBets.length > 0 ? (
            filteredBets.map(bet => (
              <tr key={bet.id}>
                <Td>{bet.username}</Td>
                <Td>{bet.type}</Td>
                <Td>{bet.numbers}</Td>
                <Td>{bet.amount.toLocaleString()}</Td>
                <Td>
                  <Status status={bet.status}>
                    {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                  </Status>
                </Td>
                <Td>{new Date(bet.drawTime).toLocaleString()}</Td>
                <Td>{new Date(bet.createdAt).toLocaleString()}</Td>
                <Td>
                  {bet.status === 'pending' && (
                    <>
                      <Button
                        variant="success"
                        onClick={() => handleStatusChange(bet.id, 'won')}
                      >
                        Won
                      </Button>
                      {' '}
                      <Button
                        variant="danger"
                        onClick={() => handleStatusChange(bet.id, 'lost')}
                      >
                        Lost
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
                    ? 'No bets found matching your filters'
                    : 'No bets found'}
                </NoData>
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default BettingManagement; 