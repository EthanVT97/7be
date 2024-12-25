import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { Button } from '../common/Button';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(0, 77, 64, 0.8); // Dark Green with opacity
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.typography.fontFamily.heading};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-shadow: ${({ theme }) => theme.shadows.glow};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const UserName = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Header: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">၂လုံး ၃လုံး</Logo>
        <Nav>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard">ပင်မစာမျက်နှာ</NavLink>
              <NavLink to="/2d">၂လုံး</NavLink>
              <NavLink to="/3d">၃လုံး</NavLink>
              <NavLink to="/wallet">ပိုက်ဆံအိတ်</NavLink>
              <UserInfo>
                <UserName>{user?.username}</UserName>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  ထွက်မည်
                </Button>
              </UserInfo>
            </>
          ) : (
            <>
              <Button variant="gradient" size="sm" as={Link} to="/login">
                ဝင်မည်
              </Button>
              <Button variant="outline" size="sm" as={Link} to="/register">
                အကောင့်ဖွင့်မည်
              </Button>
            </>
          )}
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 