import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import UserManagement from './UserManagement';
import BettingManagement from './BettingManagement';
import TransactionManagement from './TransactionManagement';
import GameManagement from './GameManagement';
import ReportsAnalytics from './ReportsAnalytics';
import { ActivityLogs } from './ActivityLogs';
import { NotificationsSystem } from './NotificationsSystem';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getDashboardStats } from '../../services/api';
import { FaUsers, FaDice, FaMoneyBillWave, FaChartLine, FaHistory } from 'react-icons/fa';

// ... existing styled components ...

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

type TabType = 'users' | 'bets' | 'transactions' | 'games' | 'reports' | 'activity';

// ... rest of the existing code ...

export const AdminDashboard: React.FC = () => {
  // ... existing state and effects ...

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <HeaderActions>
          <NotificationsSystem />
        </HeaderActions>
      </Header>

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
        <Tab 
          active={activeTab === 'activity'} 
          onClick={() => setActiveTab('activity')}
        >
          <FaHistory /> Activity Logs
        </Tab>
      </TabContainer>

      {renderContent()}
    </DashboardContainer>
  );
};

// Update the renderContent function
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
    case 'activity':
      return <ActivityLogs />;
    default:
      return null;
  }
}; 