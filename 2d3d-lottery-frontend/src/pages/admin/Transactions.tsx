import React from 'react';
import styled from 'styled-components';

const TransactionsContainer = styled.div`
  padding: 20px;
`;

const Transactions: React.FC = () => {
  return (
    <TransactionsContainer>
      <h1>Transactions</h1>
      {/* Add your transactions table or list here */}
    </TransactionsContainer>
  );
};

export default Transactions; 