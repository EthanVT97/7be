import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getUsers, updateUserStatus } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../hooks/useConfirm';

interface User {
  id: string;
  username: string;
  phoneNumber: string;
  balance: number;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin: string;
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

const Button = styled.button<{ variant?: 'danger' | 'success' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${props => 
    props.variant === 'danger' ? '#dc3545' : 
    props.variant === 'success' ? '#28a745' : 
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

const Status = styled.span<{ status: 'active' | 'suspended' }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: ${props => props.status === 'active' ? '#d4edda' : '#f8d7da'};
  color: ${props => props.status === 'active' ? '#155724' : '#721c24'};
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-bottom: 1rem;
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

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.showToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, currentStatus: 'active' | 'suspended') => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const action = currentStatus === 'active' ? 'suspend' : 'activate';

    const confirmed = await confirm({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      message: `Are you sure you want to ${action} this user?`,
      confirmText: 'Yes',
      cancelText: 'No',
      type: currentStatus === 'active' ? 'danger' : 'warning'
    });

    if (!confirmed) return;

    try {
      await updateUserStatus(userId, newStatus);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      toast.showToast(`User ${action}d successfully`, 'success');
    } catch (error) {
      toast.showToast(`Failed to ${action} user`, 'error');
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneNumber.includes(searchTerm)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SearchInput
        type="text"
        placeholder="Search by username or phone number..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table>
        <thead>
          <tr>
            <Th>Username</Th>
            <Th>Phone Number</Th>
            <Th>Balance</Th>
            <Th>Status</Th>
            <Th>Joined Date</Th>
            <Th>Last Login</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <tr key={user.id}>
                <Td>{user.username}</Td>
                <Td>{user.phoneNumber}</Td>
                <Td>{user.balance.toLocaleString()}</Td>
                <Td>
                  <Status status={user.status}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Status>
                </Td>
                <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                <Td>{new Date(user.lastLogin).toLocaleDateString()}</Td>
                <Td>
                  <Button
                    variant={user.status === 'active' ? 'danger' : 'success'}
                    onClick={() => handleStatusChange(user.id, user.status)}
                  >
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </Button>
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <Td colSpan={7}>
                <NoData>
                  {searchTerm ? 'No users found matching your search' : 'No users found'}
                </NoData>
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default UserManagement; 