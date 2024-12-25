import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.primary};
`;

const Sidebar = styled.div`
  width: 280px;
  background: rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Logo = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text.primary};
  background: ${({ active }) => active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Content = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  overflow-y: auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const Username = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Role = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Container>
      <Sidebar>
        <Logo>2D3D Admin</Logo>
        <Nav>
          <NavLink to="/admin" active={location.pathname === '/admin'}>
            ထိန်းချုပ်ခန်း
          </NavLink>
          <NavLink to="/admin/users" active={location.pathname === '/admin/users'}>
            အသုံးပြုသူများ
          </NavLink>
          <NavLink to="/admin/bets" active={location.pathname === '/admin/bets'}>
            ထီထိုးမှတ်တမ်းများ
          </NavLink>
          <NavLink to="/admin/transactions" active={location.pathname === '/admin/transactions'}>
            ငွေသွင်း/ထုတ် မှတ်တမ်းများ
          </NavLink>
          <NavLink to="/admin/settings" active={location.pathname === '/admin/settings'}>
            ဆက်တင်များ
          </NavLink>
        </Nav>
      </Sidebar>

      <div style={{ flex: 1 }}>
        <Header>
          <UserInfo>
            <Avatar>{getInitials(user?.username || '')}</Avatar>
            <div>
              <Username>{user?.username}</Username>
              <Role>Admin</Role>
            </div>
          </UserInfo>
        </Header>

        <Content>
          <Outlet />
        </Content>
      </div>
    </Container>
  );
};

export default AdminLayout; 