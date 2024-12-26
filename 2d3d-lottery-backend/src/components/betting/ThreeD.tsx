import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../store';
import { placeBet } from '../../store/slices/betsSlice';
import { BettingContainer } from '../common/GlassContainer';
import { Button } from '../common/Button';

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  text-shadow: ${({ theme }) => theme.shadows.glow};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  padding: ${({ theme }) => theme.spacing.md};
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const NumberInputGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

const BetSummary = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  h3 {
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    
    span {
      color: ${({ theme }) => theme.colors.text.primary};
      font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    }
  }
`;

const ThreeD: React.FC = () => {
  const [numbers, setNumbers] = useState(['', '', '']);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.bets);
  const { balance } = useSelector((state: RootState) => state.wallet);

  const handleNumberChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) { // Only allow single digit
      const newNumbers = [...numbers];
      newNumbers[index] = value;
      setNumbers(newNumbers);
      setError('');
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Only allow numbers
      setAmount(value);
      setError('');
    }
  };

  const validateBet = (): boolean => {
    if (numbers.some(n => n === '')) {
      setError('ထီဂဏန်း ၃လုံးလုံး ထည့်သွင်းပါ');
      return false;
    }

    const betAmount = parseInt(amount);
    if (!amount || isNaN(betAmount) || betAmount < 100) {
      setError('အနည်းဆုံး ၁၀၀ ကျပ် ထိုးရပါမည်');
      return false;
    }

    if (betAmount > balance) {
      setError('လက်ကျန်ငွေ မလုံလောက်ပါ');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBet()) return;

    try {
      await dispatch(placeBet({
        type: '3D',
        number: numbers.join(''),
        amount: parseInt(amount),
      })).unwrap();
      
      // Reset form after successful bet
      setNumbers(['', '', '']);
      setAmount('');
    } catch (err) {
      setError('ထီထိုးရာတွင် အမှားရှိနေပါသည်');
    }
  };

  return (
    <BettingContainer>
      <Title>၃လုံးထီ</Title>

      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>ထီဂဏန်းထည့်ရန်</SectionTitle>
          <NumberInputGroup>
            {numbers.map((number, index) => (
              <FormGroup key={index}>
                <Label>ဂဏန်း {index + 1}</Label>
                <Input
                  type="text"
                  value={number}
                  onChange={(e) => handleNumberChange(index, e.target.value)}
                  placeholder="0-9"
                  disabled={loading}
                  maxLength={1}
                />
              </FormGroup>
            ))}
          </NumberInputGroup>
        </Section>

        <FormGroup>
          <Label>ထိုးကြေး</Label>
          <Input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="ငွေပမာဏ ထည့်သွင်းပါ"
            disabled={loading}
          />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button
          type="submit"
          variant="gradient"
          disabled={loading}
          fullWidth
        >
          {loading ? 'ထိုးနေသည်...' : 'ထိုးမည်'}
        </Button>
      </Form>

      {numbers.some(n => n !== '') && (
        <BetSummary>
          <h3>ထိုးမည့်ထီ</h3>
          <p>ရွေးချယ်ထားသည့်ဂဏန်း: <span>{numbers.join('')}</span></p>
          <p>ထိုးက��ေး: <span>{amount ? `${parseInt(amount).toLocaleString()} ကျပ်` : '0 ကျပ်'}</span></p>
        </BetSummary>
      )}
    </BettingContainer>
  );
};

export default ThreeD; 