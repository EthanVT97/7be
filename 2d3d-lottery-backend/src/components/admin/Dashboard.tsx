import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import UserManagement from './UserManagement';
import BettingManagement from './BettingManagement';
import TransactionManagement from './TransactionManagement';
import GameManagement from './GameManagement';
import ReportsAnalytics from './ReportsAnalytics';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getDashboardStats } from '../../services/api';
import { FaUsers, FaDice, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 1px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 2px;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  font-size: 1rem;
  color: ${props => props.active ? '#007bff' : '#666'};
  border-bottom: 2px solid ${props => props.active ? '#007bff' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #007bff;
  }

  svg {
    font-size: 1.1rem;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ trend?: 'up' | 'down' }>`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: ${props => 
      props.trend === 'up' ? '#28a745' : 
      props.trend === 'down' ? '#dc3545' : 
      '#007bff'};
  }
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #007bff;
  }
`;

const StatValue = styled.p`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const StatTrend = styled.span<{ type: 'up' | 'down' }>`
  font-size: 0.875rem;
  color: ${props => props.type === 'up' ? '#28a745' : '#dc3545'};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
`;

type TabType = 'users' | 'bets' | 'transactions' | 'games' | 'reports';

interface DashboardStats {
  totalUsers: number;
  todayBets: number;
  pendingWithdrawals: number;
  todayRevenue: number;
  userGrowth: number;
  betGrowth: number;
  revenueGrowth: number;
  withdrawalGrowth: number;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    todayBets: 0,
    pendingWithdrawals: 0,
    todayRevenue: 0,
    userGrowth: 0,
    betGrowth: 0,
    revenueGrowth: 0,
    withdrawalGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not admin
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'bets':
        return <BettingManagement />;
      case 'transactions':
        return <TransactionManagement />;
      case 'games':
        return <GameManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      default:
        return null;
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <Stats>
          <StatCard trend={stats.userGrowth > 0 ? 'up' : 'down'}>
            <StatTitle>
              <FaUsers /> Total Users
            </StatTitle>
            <StatValue>{stats.totalUsers.toLocaleString()}</StatValue>
            <StatTrend type={stats.userGrowth > 0 ? 'up' : 'down'}>
              {stats.userGrowth > 0 ? '↑' : '↓'} {Math.abs(stats.userGrowth)}% from last week
            </StatTrend>
          </StatCard>
          <StatCard trend={stats.betGrowth > 0 ? 'up' : 'down'}>
            <StatTitle>
              <FaDice /> Today's Bets
            </StatTitle>
            <StatValue>{stats.todayBets.toLocaleString()}</StatValue>
            <StatTrend type={stats.betGrowth > 0 ? 'up' : 'down'}>
              {stats.betGrowth > 0 ? '↑' : '↓'} {Math.abs(stats.betGrowth)}% from yesterday
            </StatTrend>
          </StatCard>
          <StatCard trend={stats.withdrawalGrowth > 0 ? 'up' : 'down'}>
            <StatTitle>
              <FaMoneyBillWave /> Pending Withdrawals
            </StatTitle>
            <StatValue>{stats.pendingWithdrawals.toLocaleString()}</StatValue>
            <StatTrend type={stats.withdrawalGrowth > 0 ? 'up' : 'down'}>
              {stats.withdrawalGrowth > 0 ? '↑' : '↓'} {Math.abs(stats.withdrawalGrowth)}% from yesterday
            </StatTrend>
          </StatCard>
          <StatCard trend={stats.revenueGrowth > 0 ? 'up' : 'down'}>
            <StatTitle>
              <FaChartLine /> Today's Revenue
            </StatTitle>
            <StatValue>{stats.todayRevenue.toLocaleString()}</StatValue>
            <StatTrend type={stats.revenueGrowth > 0 ? 'up' : 'down'}>
              {stats.revenueGrowth > 0 ? '↑' : '↓'} {Math.abs(stats.revenueGrowth)}% from yesterday
            </StatTrend>
          </StatCard>
        </Stats>
      </Header>

      <TabContainer>
        <Tab 
          active={activeTab === 'users'} 
          onClick={() => setActiveTab('users')}
        >
          <FaUsers /> Users
        </Tab>
        <Tab 
          active={activeTab === 'bets'} 
          onClick={() => setActiveTab('bets')}
        >
          <FaDice /> Bets
        </Tab>
        <Tab 
          active={activeTab === 'transactions'} 
          onClick={() => setActiveTab('transactions')}
        >
          <FaMoneyBillWave /> Transactions
        </Tab>
        <Tab 
          active={activeTab === 'games'} 
          onClick={() => setActiveTab('games')}
        >
          <FaDice /> Games
        </Tab>
        <Tab 
          active={activeTab === 'reports'} 
          onClick={() => setActiveTab('reports')}
        >
          <FaChartLine /> Reports & Analytics
        </Tab>
      </TabContainer>

      {renderContent()}
    </DashboardContainer>
  );
};

export default AdminDashboard; 