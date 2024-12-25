import React, { useState, useEffect } from 'react';
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

const NumberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const NumberButton = styled(Button)<{ isSelected: boolean }>`
  aspect-ratio: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  padding: 0;
  background: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  
  &:hover {
    background: ${({ isSelected, theme }) =>
      isSelected ? theme.colors.primary : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
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

const TwoD: React.FC = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.bets);
  const { balance } = useSelector((state: RootState) => state.wallet);

  // Generate numbers from 00-99
  const numbers = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));

  const handleNumberClick = (number: string) => {
    setSelectedNumbers(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      }
      return [...prev, number];
    });
    setError('');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Only allow numbers
      setAmount(value);
      setError('');
    }
  };

  const validateBet = (): boolean => {
    if (selectedNumbers.length === 0) {
      setError('ထီဂဏန်း ရွေးချယ်ပါ');
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
      // Place bet for each selected number
      for (const number of selectedNumbers) {
        await dispatch(placeBet({
          type: '2D',
          number,
          amount: parseInt(amount),
        })).unwrap();
      }
      
      // Reset form after successful bet
      setSelectedNumbers([]);
      setAmount('');
    } catch (err) {
      setError('ထီထိုးရာတွင် အမှားရှိနေပါသည်');
    }
  };

  return (
    <BettingContainer>
      <Title>၂လုံးထီ</Title>

      <Section>
        <SectionTitle>ထီဂဏန်းရွေးရန်</SectionTitle>
        <NumberGrid>
          {numbers.map(number => (
            <NumberButton
              key={number}
              variant="outline"
              isSelected={selectedNumbers.includes(number)}
              onClick={() => handleNumberClick(number)}
              disabled={loading}
            >
              {number}
            </NumberButton>
          ))}
        </NumberGrid>
      </Section>

      <Form onSubmit={handleSubmit}>
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

      {selectedNumbers.length > 0 && (
        <BetSummary>
          <h3>ထိုးမည့်ထီများ</h3>
          <p>ရွေးချယ်ထားသည့်ဂဏန်းများ: <span>{selectedNumbers.join(', ')}</span></p>
          <p>စုစုပေါင်းထိုးကြေး: <span>{amount ? `${parseInt(amount).toLocaleString()} ကျပ်` : '0 ကျပ်'}</span></p>
          <p>ထိုးမည့်ပွဲအရေအတွက်: <span>{selectedNumbers.length}</span></p>
          <p>စုစုပေါင်းကုန်ကျငွေ: <span>{amount ? `${(parseInt(amount) * selectedNumbers.length).toLocaleString()} ကျပ်` : '0 ကျပ်'}</span></p>
        </BetSummary>
      )}
    </BettingContainer>
  );
};

export default TwoD; 