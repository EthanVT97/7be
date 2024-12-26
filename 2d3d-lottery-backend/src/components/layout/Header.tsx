import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { routes } from '../../routes/routes';
import Button from '../common/Button';
import Drawer from '../common/Drawer';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.light};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  padding: ${({ theme }) => theme.space.md} 0;
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.sticky};
`;

const HeaderContent = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.xl};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  color: ${({ theme }) => theme.colors.gray600};
  padding: ${({ theme }) => theme.space.xs};
  border-radius: ${({ theme }) => theme.radii.md};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.gray600};
  text-decoration: none;
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.gray100};
  }
`;

const MobileNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
`;

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    // Public routes
    !isAuthenticated && { path: routes.login.path, label: 'Login' },
    !isAuthenticated && { path: routes.register.path, label: 'Register' },

    // User routes
    isAuthenticated && { path: routes.dashboard.path, label: 'Dashboard' },
    isAuthenticated && { path: routes.betting.path, label: 'Place Bet' },
    isAuthenticated && { path: routes.wallet.path, label: 'Wallet' },
    isAuthenticated && { path: routes.transactions.path, label: 'Transactions' },

    // Admin routes
    isAdmin && { path: routes.adminDashboard.path, label: 'Admin' },
  ].filter(Boolean);

  const renderNavItems = () => (
    <>
      {navItems.map(
        (item) =>
          item && (
            <NavLink
              key={item.path}
              to={item.path}
              active={isActive(item.path)}
            >
              {item.label}
            </NavLink>
          )
      )}
      {isAuthenticated && (
        <Button variant="outline" size="small" onClick={logout}>
          Logout
        </Button>
      )}
    </>
  );

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">2D3D Lottery</Logo>
        <Nav>{renderNavItems()}</Nav>
        <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
          ☰
        </MobileMenuButton>
      </HeaderContent>

      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        position="right"
        title="Menu"
      >
        <MobileNav>{renderNavItems()}</MobileNav>
      </Drawer>
    </HeaderContainer>
  );
};

export default Header; 