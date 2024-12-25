import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../store';
import { updateSettings } from '../../store/slices/adminSlice';
import { Button } from '../common/Button';

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 600px;
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    minBetAmount: 100,
    minDepositAmount: 1000,
    maxWithdrawAmount: 1000000,
    twoDCloseTime: 30,
    threeDCloseTime: 60,
  });
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.admin);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(updateSettings(settings)).unwrap();
      setError('');
    } catch (err) {
      setError('ဆက်တင်များ ပြောင်းလဲရာတွင် အမှားရှိနေပါသည်');
    }
  };

  return (
    <div>
      <Title>ဆက်တင်များ</Title>

      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>ငွေကြေးဆက်တင်များ</SectionTitle>
          <FormGroup>
            <Label>အနည်းဆုံးထိုးကြေး</Label>
            <Input
              type="number"
              name="minBetAmount"
              value={settings.minBetAmount}
              onChange={handleChange}
              min="100"
              step="100"
            />
          </FormGroup>
          <FormGroup>
            <Label>အနည်းဆုံးငွေသွင်းပမာဏ</Label>
            <Input
              type="number"
              name="minDepositAmount"
              value={settings.minDepositAmount}
              onChange={handleChange}
              min="1000"
              step="1000"
            />
          </FormGroup>
          <FormGroup>
            <Label>အများဆုံးငွေထုတ်ပမာဏ</Label>
            <Input
              type="number"
              name="maxWithdrawAmount"
              value={settings.maxWithdrawAmount}
              onChange={handleChange}
              min="10000"
              step="10000"
            />
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>အချိန်ဆက်တင်များ</SectionTitle>
          <FormGroup>
            <Label>၂လုံးထီ ပိတ်ချိန် (မိနစ်)</Label>
            <Input
              type="number"
              name="twoDCloseTime"
              value={settings.twoDCloseTime}
              onChange={handleChange}
              min="5"
              step="5"
            />
          </FormGroup>
          <FormGroup>
            <Label>၃လုံးထီ ပိတ်ချိန် (မိနစ်)</Label>
            <Input
              type="number"
              name="threeDCloseTime"
              value={settings.threeDCloseTime}
              onChange={handleChange}
              min="5"
              step="5"
            />
          </FormGroup>
        </Section>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button
          type="submit"
          variant="gradient"
          disabled={loading}
        >
          {loading ? 'သိမ်းဆည်းနေသည်...' : 'သိမ်းဆည်းမည်'}
        </Button>
      </Form>
    </div>
  );
};

export default Settings; 