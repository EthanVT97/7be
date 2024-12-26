import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getActivityLogs } from '../../services/api';
import { wsService } from '../../services/websocket';
import { FaUser, FaGamepad, FaMoneyBillWave, FaCog, FaFilter, FaDownload } from 'react-icons/fa';

const Container = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  color: #1a1a1a;
  margin: 0;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  color: #495057;
  font-weight: 500;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  min-width: 150px;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
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

const ActionIcon = styled.span<{ type: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => {
    switch (props.type) {
      case 'user': return '#e3f2fd';
      case 'game': return '#f3e5f5';
      case 'transaction': return '#e8f5e9';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'user': return '#1976d2';
      case 'game': return '#9c27b0';
      case 'transaction': return '#43a047';
      default: return '#757575';
    }
  }};
  margin-right: 0.5rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.active ? '#007bff' : '#dee2e6'};
  background: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#212529'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f8f9fa'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

interface ActivityLog {
  id: string;
  type: 'user' | 'game' | 'transaction' | 'system';
  action: string;
  description: string;
  userId?: string;
  username?: string;
  timestamp: string;
  details: any;
}

interface FilterOptions {
  type: string;
  timeRange: string;
  startDate: string;
  endDate: string;
  username: string;
}

export const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    timeRange: '24h',
    startDate: '',
    endDate: '',
    username: '',
  });

  useEffect(() => {
    fetchLogs();

    // Subscribe to WebSocket activity logs
    const unsubscribe = wsService.subscribe('activity_log', (log: ActivityLog) => {
      if (matchesFilters(log)) {
        setLogs(prev => [log, ...prev].slice(0, 10)); // Keep only the latest 10 logs in view
        setTotalPages(prev => Math.ceil((prev * 10 + 1) / 10));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [filters]);

  const matchesFilters = (log: ActivityLog): boolean => {
    if (filters.type !== 'all' && log.type !== filters.type) return false;
    if (filters.username && !log.username?.toLowerCase().includes(filters.username.toLowerCase())) return false;

    const logDate = new Date(log.timestamp);
    const now = new Date();

    switch (filters.timeRange) {
      case '24h':
        return now.getTime() - logDate.getTime() <= 24 * 60 * 60 * 1000;
      case '7d':
        return now.getTime() - logDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
      case '30d':
        return now.getTime() - logDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
      case 'custom':
        const start = filters.startDate ? new Date(filters.startDate) : null;
        const end = filters.endDate ? new Date(filters.endDate) : null;
        return (!start || logDate >= start) && (!end || logDate <= end);
      default:
        return true;
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getActivityLogs({ page, ...filters });
      setLogs(response.data.logs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/activity-logs/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-logs-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export activity logs:', error);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <FaUser />;
      case 'game':
        return <FaGamepad />;
      case 'transaction':
        return <FaMoneyBillWave />;
      default:
        return <FaCog />;
    }
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <Container>
      <Header>
        <Title>Activity Logs</Title>
        <HeaderActions>
          <Button onClick={handleExport}>
            <FaDownload /> Export Logs
          </Button>
        </HeaderActions>
      </Header>

      <FiltersContainer>
        <FilterGroup>
          <FilterLabel>Type</FilterLabel>
          <Select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">All Activities</option>
            <option value="user">User Activities</option>
            <option value="game">Game Activities</option>
            <option value="transaction">Transactions</option>
            <option value="system">System Activities</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Time Range</FilterLabel>
          <Select
            value={filters.timeRange}
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </Select>
        </FilterGroup>

        {filters.timeRange === 'custom' && (
          <>
            <FilterGroup>
              <FilterLabel>Start Date</FilterLabel>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>End Date</FilterLabel>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </FilterGroup>
          </>
        )}

        <FilterGroup>
          <FilterLabel>Username</FilterLabel>
          <Input
            type="text"
            placeholder="Search by username"
            value={filters.username}
            onChange={(e) => handleFilterChange('username', e.target.value)}
          />
        </FilterGroup>
      </FiltersContainer>

      <Table>
        <thead>
          <tr>
            <Th>Action</Th>
            <Th>Description</Th>
            <Th>User</Th>
            <Th>Timestamp</Th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <Td colSpan={4}>Loading...</Td>
            </tr>
          ) : logs.length === 0 ? (
            <tr>
              <Td colSpan={4}>No activity logs found</Td>
            </tr>
          ) : (
            logs.map(log => (
              <tr key={log.id}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ActionIcon type={log.type}>
                      {getActionIcon(log.type)}
                    </ActionIcon>
                    {log.action}
                  </div>
                </Td>
                <Td>{log.description}</Td>
                <Td>{log.username || 'System'}</Td>
                <Td>{new Date(log.timestamp).toLocaleString()}</Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Pagination>
        <PageButton
          disabled={page === 1}
          onClick={() => setPage(prev => Math.max(1, prev - 1))}
        >
          Previous
        </PageButton>
        <span>
          Page {page} of {totalPages}
        </span>
        <PageButton
          disabled={page === totalPages}
          onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
        >
          Next
        </PageButton>
      </Pagination>
    </Container>
  );
}; 