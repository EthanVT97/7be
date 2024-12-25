import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { Button } from '../common/Button';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Sidebar = styled.div`
  width: 250px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Logo = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const NavItem = styled(Button)<{ active?: boolean }>`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ active, theme }) =>
    active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Content = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  overflow-y: auto;
`;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentPath = window.location.pathname;

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (err) {
      // Handle error
    }
  };

  const navItems = [
    { path: '/admin', label: 'ထိန်းချုပ်ခန်း' },
    { path: '/admin/users', label: 'အသုံးပြုသူများ' },
    { path: '/admin/bets', label: 'ထီထိုးမှတ်တမ်းများ' },
    { path: '/admin/transactions', label: 'ငွေသွင်း/ထုတ်မှတ်တမ်းများ' },
    { path: '/admin/settings', label: 'ဆက်တင်များ' },
  ];

  return (
    <Container>
      <Sidebar>
        <Logo>2D3D Admin</Logo>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            variant="text"
            active={currentPath === item.path}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </NavItem>
        ))}
        <NavItem
          variant="outline"
          onClick={handleLogout}
          style={{ marginTop: 'auto' }}
        >
          ထွက်မည်
        </NavItem>
      </Sidebar>
      <Content>{children}</Content>
    </Container>
  );
};

export default AdminLayout; 