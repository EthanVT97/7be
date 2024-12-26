import React, { useState } from 'react';
import { Form, Input, Button, InfoText, Divider } from './styles';
import { register } from '../../services/api';
import type { AuthResponse, ErrorResponse } from '../../types/api';
import ModalWrapper from './ModalWrapper';

export interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: AuthResponse) => void;
  onLoginClick?: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  onLoginClick 
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await register(name, phone, password);
      localStorage.setItem('token', data.token);
      onSuccess?.(data);
      onClose();
    } catch (err) {
      const error = err as { response?: { data: ErrorResponse } };
      setError(error.response?.data.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Register"
      error={error}
      isLoading={isLoading}
    >
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="name"
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="tel"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={6}
          autoComplete="new-password"
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={6}
          autoComplete="new-password"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </Form>

      {onLoginClick && (
        <>
          <Divider />
          <InfoText>Already have an account?</InfoText>
          <Button 
            type="button" 
            onClick={onLoginClick}
            variant="primary"
            disabled={isLoading}
          >
            Login
          </Button>
        </>
      )}
    </ModalWrapper>
  );
};

export default RegisterModal; 