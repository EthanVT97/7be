import React, { useState, useEffect } from 'react';
import { Form, Button, InfoText } from './styles';
import { getBettingHistory } from '../../services/api';
import type { BetHistoryItem, ErrorResponse } from '../../types/api';
import ModalWrapper from './ModalWrapper';
import styled from 'styled-components';

export interface BettingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
    font-size: 0.875rem;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: 500;
    color: #495057;
  }

  tr:hover td {
    background-color: #f8f9fa;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const PageInfo = styled.span`
  color: #6c757d;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span<{ status: BetHistoryItem['status'] }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ status }) => {
    switch (status) {
      case 'won':
        return 'background-color: #d4edda; color: #155724;';
      case 'lost':
        return 'background-color: #f8d7da; color: #721c24;';
      default:
        return 'background-color: #fff3cd; color: #856404;';
    }
  }}
`;

const Amount = styled.span<{ type: 'win' | 'bet' }>`
  color: ${props => props.type === 'win' ? '#28a745' : '#6c757d'};
  font-weight: ${props => props.type === 'win' ? '500' : 'normal'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
`;

export const BettingHistoryModal: React.FC<BettingHistoryModalProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<BetHistoryItem[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (isOpen) {
      loadHistory(1);
    }
  }, [isOpen]);

  const loadHistory = async (pageNum: number) => {
    setIsLoading(true);
    setError('');

    try {
      const { data } = await getBettingHistory(pageNum);
      setHistory(data.items);
      setTotalPages(Math.ceil(data.total / data.limit));
      setPage(pageNum);
    } catch (err) {
      const error = err as { response?: { data: ErrorResponse } };
      setError(error.response?.data.message || 'Failed to load betting history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Betting History"
      error={error}
      isLoading={isLoading}
      maxWidth="800px"
    >
      {history.length === 0 ? (
        <EmptyState>No betting history found</EmptyState>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Numbers</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Result</th>
                <th>Win Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map((bet) => (
                <tr key={bet.id}>
                  <td>{formatDate(bet.createdAt)}</td>
                  <td>{bet.type}</td>
                  <td>{bet.numbers.join(', ')}</td>
                  <td>
                    <Amount type="bet">
                      {bet.totalAmount.toLocaleString()}
                    </Amount>
                  </td>
                  <td>
                    <StatusBadge status={bet.status}>
                      {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                    </StatusBadge>
                  </td>
                  <td>{bet.result || '-'}</td>
                  <td>
                    {bet.winAmount ? (
                      <Amount type="win">
                        {bet.winAmount.toLocaleString()}
                      </Amount>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <Button
              type="button"
              onClick={() => loadHistory(page - 1)}
              disabled={page === 1 || isLoading}
              variant="primary"
            >
              Previous
            </Button>
            <PageInfo>
              Page {page} of {totalPages}
            </PageInfo>
            <Button
              type="button"
              onClick={() => loadHistory(page + 1)}
              disabled={page === totalPages || isLoading}
              variant="primary"
            >
              Next
            </Button>
          </Pagination>
        </>
      )}
    </ModalWrapper>
  );
};

export default BettingHistoryModal; 