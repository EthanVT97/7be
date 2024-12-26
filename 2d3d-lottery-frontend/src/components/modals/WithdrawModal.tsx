import React, { useState } from 'react';
import { Form, Input, Button, InfoText } from './styles';
import { withdraw } from '../../services/api';
import type { ErrorResponse } from '../../types/api';
import ModalWrapper from './ModalWrapper';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../contexts/ToastContext';
import styled from 'styled-components';

export interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  balance: number;
}

interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

const MAX_WITHDRAW = Number(process.env.REACT_APP_MAX_WITHDRAW_AMOUNT) || 1000000;

const InfoBox = styled.div`
  background-color: #e9ecef;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #495057;
`;

const BalanceInfo = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 500;
  color: #28a745;
`;

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  balance 
}) => {
  const [amount, setAmount] = useState('');
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    bankName: '',
    accountNumber: '',
    accountName: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const confirm = useConfirm();
  const toast = useToast();

  const handleAmountChange = (value: string) => {
    const newValue = value.replace(/[^0-9]/g, '');
    setAmount(newValue);
  };

  const handleBankInfoChange = (field: keyof BankInfo, value: string) => {
    setBankInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): string | null => {
    const withdrawAmount = Number(amount);
    if (!withdrawAmount) {
      return 'Please enter a valid amount';
    }
    if (withdrawAmount > balance) {
      return 'Insufficient balance';
    }
    if (withdrawAmount > MAX_WITHDRAW) {
      return `Maximum withdrawal amount is ${MAX_WITHDRAW}`;
    }
    if (!bankInfo.bankName.trim()) {
      return 'Please enter bank name';
    }
    if (!bankInfo.accountNumber.trim()) {
      return 'Please enter account number';
    }
    if (!bankInfo.accountName.trim()) {
      return 'Please enter account name';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const withdrawAmount = Number(amount);
    const confirmed = await confirm({
      title: 'Confirm Withdrawal',
      message: `Are you sure you want to withdraw ${withdrawAmount.toLocaleString()} to ${bankInfo.bankName} account ${bankInfo.accountNumber}?`,
      confirmText: 'Withdraw',
      type: 'warning'
    });

    if (!confirmed) return;

    setError('');
    setIsLoading(true);

    try {
      const accountInfo = JSON.stringify(bankInfo);
      await withdraw(withdrawAmount, accountInfo);
      toast.showToast('Withdrawal request submitted successfully', 'success');
      onSuccess?.();
      onClose();
    } catch (err) {
      const error = err as { response?: { data: ErrorResponse } };
      setError(error.response?.data.message || 'Failed to process withdrawal');
      toast.showToast('Failed to process withdrawal', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Withdraw"
      error={error}
      isLoading={isLoading}
    >
      <InfoBox>
        Please enter your withdrawal amount and bank account details.
        The amount will be transferred within 24 hours after verification.
      </InfoBox>

      <BalanceInfo>
        Available Balance: {balance.toLocaleString()}
      </BalanceInfo>
      
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder={`Amount (max: ${MAX_WITHDRAW.toLocaleString()})`}
          value={amount}
          onChange={e => handleAmountChange(e.target.value)}
          required
          disabled={isLoading}
          min={1}
          max={Math.min(balance, MAX_WITHDRAW)}
        />
        <Input
          type="text"
          placeholder="Bank Name"
          value={bankInfo.bankName}
          onChange={e => handleBankInfoChange('bankName', e.target.value)}
          required
          disabled={isLoading}
        />
        <Input
          type="text"
          placeholder="Account Number"
          value={bankInfo.accountNumber}
          onChange={e => handleBankInfoChange('accountNumber', e.target.value)}
          required
          disabled={isLoading}
          pattern="[0-9]+"
          title="Please enter a valid account number"
        />
        <Input
          type="text"
          placeholder="Account Name"
          value={bankInfo.accountName}
          onChange={e => handleBankInfoChange('accountName', e.target.value)}
          required
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || balance === 0}
          variant={balance === 0 ? 'danger' : undefined}
        >
          {isLoading ? 'Processing...' : balance === 0 ? 'No Balance Available' : 'Submit Withdrawal'}
        </Button>
      </Form>
    </ModalWrapper>
  );
};

export default WithdrawModal; 