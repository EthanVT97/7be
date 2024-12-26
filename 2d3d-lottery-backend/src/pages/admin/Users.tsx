import React from 'react';
import styled from 'styled-components';

const UsersContainer = styled.div`
  padding: 20px;
`;

const Users: React.FC = () => {
  return (
    <UsersContainer>
      <h1>Users</h1>
      {/* Add your users table or list here */}
    </UsersContainer>
  );
};

export default Users; 