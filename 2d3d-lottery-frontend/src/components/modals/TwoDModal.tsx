import React, { useState, useEffect } from 'react';
import { Form, Input, Button, InfoText } from './styles';
import { place2DBet, get2DStatus } from '../../services/api';
import type { GameStatus, ErrorResponse } from '../../types/api';
import ModalWrapper from './ModalWrapper';
import styled from 'styled-components';

export interface TwoDModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const MIN_BET = Number(process.env.REACT_APP_MIN_BET_AMOUNT) || 100;

const GameStatusInfo = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  
  > div {
    margin: 0.5rem 0;
    &:first-child {
      font-weight: 500;
      color: #28a745;
    }
    &:last-child {
      color: #dc3545;
    }
  }
`;

const BetRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const TwoDModal: React.FC<TwoDModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [numbers, setNumbers] = useState<string[]>(['']);
  const [amounts, setAmounts] = useState<string[]>(['']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadGameStatus();
    }
  }, [isOpen]);

  const loadGameStatus = async () => {
    try {
      const { data } = await get2DStatus();
      setGameStatus(data);
    } catch (err) {
      const error = err as { response?: { data: ErrorResponse } };
      setError(error.response?.data.message || 'Failed to load game status');
    }
  };

  const addBet = () => {
    setNumbers([...numbers, '']);
    setAmounts([...amounts, '']);
  };

  const removeBet = (index: number) => {
    setNumbers(numbers.filter((_, i) => i !== index));
    setAmounts(amounts.filter((_, i) => i !== index));
  };

  const updateNumber = (index: number, value: string) => {
    const newValue = value.replace(/[^0-9]/g, '').slice(0, 2);
    const newNumbers = [...numbers];
    newNumbers[index] = newValue;
    setNumbers(newNumbers);
  };

  const updateAmount = (index: number, value: string) => {
    const newValue = value.replace(/[^0-9]/g, '');
    const newAmounts = [...amounts];
    newAmounts[index] = newValue;
    setAmounts(newAmounts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate numbers
    const invalidNumbers = numbers.some(num => num.length !== 2);
    if (invalidNumbers) {
      setError('All numbers must be 2 digits');
      return;
    }

    // Validate amounts
    const numericAmounts = amounts.map(Number);
    const invalidAmounts = numericAmounts.some(amount => amount < MIN_BET);
    if (invalidAmounts) {
      setError(`Minimum bet amount is ${MIN_BET}`);
      return;
    }

    if (!gameStatus?.isOpen) {
      setError('Betting is currently closed');
      return;
    }

    setIsLoading(true);

    try {
      await place2DBet(numbers, numericAmounts);
      onSuccess?.();
      onClose();
    } catch (err) {
      const error = err as { response?: { data: ErrorResponse } };
      setError(error.response?.data.message || 'Failed to place bet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="2D Betting"
      error={error}
      isLoading={isLoading}
    >
      {gameStatus && (
        <GameStatusInfo>
          <div>Next Draw: {new Date(gameStatus.nextDrawTime).toLocaleString()}</div>
          <div>Closes in: {gameStatus.closesIn} minutes</div>
          {gameStatus.lastResult && <div>Last Result: {gameStatus.lastResult}</div>}
        </GameStatusInfo>
      )}

      <Form onSubmit={handleSubmit}>
        {numbers.map((number, index) => (
          <BetRow key={index}>
            <Input
              type="text"
              placeholder="Number (00-99)"
              value={number}
              onChange={e => updateNumber(index, e.target.value)}
              required
              disabled={isLoading}
              style={{ width: '120px' }}
              pattern="[0-9]{2}"
              title="Please enter a 2-digit number"
            />
            <Input
              type="text"
              placeholder={`Amount (min: ${MIN_BET})`}
              value={amounts[index]}
              onChange={e => updateAmount(index, e.target.value)}
              required
              disabled={isLoading}
              min={MIN_BET}
            />
            {index > 0 && (
              <Button 
                type="button" 
                onClick={() => removeBet(index)}
                disabled={isLoading}
                variant="danger"
              >
                Remove
              </Button>
            )}
          </BetRow>
        ))}
        
        <Button 
          type="button" 
          onClick={addBet}
          disabled={isLoading}
          variant="success"
        >
          Add Number
        </Button>

        <InfoText>
          Minimum bet amount: {MIN_BET.toLocaleString()} per number
        </InfoText>

        <Button 
          type="submit" 
          disabled={isLoading || !gameStatus?.isOpen}
          variant="primary"
        >
          {isLoading ? 'Placing Bet...' : 'Place Bet'}
        </Button>
      </Form>
    </ModalWrapper>
  );
};

export default TwoDModal; 