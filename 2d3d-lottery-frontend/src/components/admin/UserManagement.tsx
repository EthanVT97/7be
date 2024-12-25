import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchUsers, updateUserStatus } from '../../store/slices/adminSlice';
import { Button } from '../common/Button';

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SearchBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SearchInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  padding: ${({ theme }) => theme.spacing.md};
  width: 300px;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const Th = styled.th`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
`;

const Td = styled.td`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Status = styled.span<{ active: boolean }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme, active }) => active ? theme.colors.success : theme.colors.error}20;
  color: ${({ theme, active }) => active ? theme.colors.success : theme.colors.error};
`;

const ActionButton = styled(Button)`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  isActive: boolean;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers({ page, search }));
  }, [dispatch, page, search]);

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      await dispatch(updateUserStatus({ userId, isActive: !isActive })).unwrap();
      dispatch(fetchUsers({ page, search }));
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  return (
    <div>
      <Title>အသုံးပြုသူများ စီမံခန့်ခွဲခြင်း</Title>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="အသုံးပြုသူအမည် သို့မဟုတ် အီးမေးလ်ဖြင့် ရှာရန်..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBar>

      <Table>
        <thead>
          <tr>
            <Th>အသုံးပြုသူအမည်</Th>
            <Th>အီးမေးလ်</Th>
            <Th>လက်ကျန်ငွေ</Th>
            <Th>အခြေအနေ</Th>
            <Th>လာရင်းဖွင့်သည့်ရက်</Th>
            <Th>လုပ်ဆောင်ချက်</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id}>
              <Td>{user.username}</Td>
              <Td>{user.email}</Td>
              <Td>{user.balance.toLocaleString()}</Td>
              <Td>
                <Status active={user.isActive}>
                  {user.isActive ? 'အသုံးပြုနိုင်' : 'ပိတ်ထား'}
                </Status>
              </Td>
              <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
              <Td>
                <ActionButton
                  variant={user.isActive ? 'danger' : 'success'}
                  onClick={() => handleStatusChange(user.id, user.isActive)}
                  disabled={loading}
                >
                  {user.isActive ? 'ပိတ်မည်' : 'ဖွင့်မည်'}
                </ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Button
          variant="outline"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          ရှေ့
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage(p => p + 1)}
          disabled={users.length < 10 || loading}
        >
          နောက်
        </Button>
      </Pagination>
    </div>
  );
};

export default UserManagement; 