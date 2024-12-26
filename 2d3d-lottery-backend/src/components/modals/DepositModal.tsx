import React, { useState } from 'react';
import { Form, Input, Button, InfoText } from './styles';
import { deposit } from '../../services/api';
import type { ErrorResponse } from '../../types/api';
import ModalWrapper from './ModalWrapper';
import styled from 'styled-components';

export interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const MIN_DEPOSIT = Number(process.env.REACT_APP_MIN_DEPOSIT_AMOUNT) || 1000;

const InfoBox = styled.div`
  background-color: #e9ecef;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #495057;
`;

const PaymentInfo = styled.div`
  margin: 1.5rem 0;
  padding: 1.25rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: #fff;

  h4 {
    margin: 0 0 1rem;
    color: #212529;
    font-size: 1rem;
    font-weight: 500;
  }

  div {
    margin: 0.5rem 0;
    color: #495057;
    display: flex;
    justify-content: space-between;
    
    span:last-child {
      font-weight: 500;
      color: #212529;
    }
  }
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  padding: 0;
  font-size: 0.875rem;
  margin-left: 0.5rem;

  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }
`;

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const handleAmountChange = (value: string) => {
    const newValue = value.replace(/[^0-9]/g, '');
    setAmount(newValue);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${field} copied!`);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const depositAmount = Number(amount);
    if (depositAmount < MIN_DEPOSIT) {
      setError(`Minimum deposit amount is ${MIN_DEPOSIT}`);
      return;
    }

    if (!transactionId.trim()) {
      setError('Please enter the transaction ID');
      return;
    }

    setIsLoading(true);

    try {
      await deposit(depositAmount, transactionId);
      onSuccess?.();
      onClose();
    } catch (err) {
      const error = err as { response?: { data: ErrorResponse } };
      setError(error.response?.data.message || 'Failed to process deposit');
    } finally {
      setIsLoading(false);
    }
  };

  const paymentDetails = {
    bank: 'KBZ Bank',
    accountName: '2D3D Lottery',
    accountNumber: '12345678'
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Deposit"
      error={error}
      isLoading={isLoading}
    >
      <InfoBox>
        Please transfer the amount to our payment account and enter the transaction 
        details below. Your account will be credited once we verify the transaction.
      </InfoBox>

      <PaymentInfo>
        <h4>Payment Details</h4>
        {Object.entries(paymentDetails).map(([key, value]) => (
          <div key={key}>
            <span>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
            <span>
              {value}
              <CopyButton 
                onClick={() => copyToClipboard(value, key)}
                type="button"
              >
                Copy
              </CopyButton>
            </span>
          </div>
        ))}
      </PaymentInfo>

      {copySuccess && (
        <InfoText style={{ color: '#28a745' }}>{copySuccess}</InfoText>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder={`Amount (min: ${MIN_DEPOSIT.toLocaleString()})`}
          value={amount}
          onChange={e => handleAmountChange(e.target.value)}
          required
          disabled={isLoading}
          min={MIN_DEPOSIT}
        />
        <Input
          type="text"
          placeholder="Transaction ID"
          value={transactionId}
          onChange={e => setTransactionId(e.target.value)}
          required
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Submit Deposit'}
        </Button>
      </Form>
    </ModalWrapper>
  );
};

export default DepositModal; 