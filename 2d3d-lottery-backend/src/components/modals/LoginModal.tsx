import React, { useState } from 'react';
import { Form, Input, Button, InfoText, Divider } from './styles';
import { login } from '../../services/api';
import type { AuthResponse, ErrorResponse } from '../../types/api';
import ModalWrapper from './ModalWrapper';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: AuthResponse) => void;
  onRegisterClick?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  onRegisterClick 
}) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await login(phone, password);
      localStorage.setItem('token', data.token);
      onSuccess?.(data);
      onClose();
    } catch (err) {
      const error = err as { response?: { data: ErrorResponse } };
      setError(error.response?.data.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Login"
      error={error}
      isLoading={isLoading}
    >
      <Form onSubmit={handleSubmit}>
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
          autoComplete="current-password"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>

      {onRegisterClick && (
        <>
          <Divider />
          <InfoText>Don't have an account?</InfoText>
          <Button 
            type="button" 
            onClick={onRegisterClick}
            variant="success"
            disabled={isLoading}
          >
            Register Now
          </Button>
        </>
      )}
    </ModalWrapper>
  );
};

export default LoginModal; 