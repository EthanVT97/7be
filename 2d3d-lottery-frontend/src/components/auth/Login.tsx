import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../../store';
import { login } from '../../store/slices/authSlice';
import { LoginContainer } from '../common/GlassContainer';
import { Button } from '../common/Button';

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-shadow: ${({ theme }) => theme.shadows.glow};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  padding: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 128, 128, 0.2);
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

const RegisterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
  text-decoration: none;
  margin-top: ${({ theme }) => theme.spacing.md};
  
  &:hover {
    text-decoration: underline;
  }
`;

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const validateForm = () => {
    const errors = {
      username: '',
      password: '',
    };
    let isValid = true;

    if (!formData.username) {
      errors.username = 'အသုံးပြုသူအမည် ထည့်သွင်းပါ';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'စကားဝှက် ထည့်သွင်းပါ';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'စကားဝှက်သည် အနည်းဆုံး ၆ လုံး ရှိရပါမည်';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(login(formData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the auth slice
    }
  };

  return (
    <LoginContainer>
      <Title>အကောင့်ဝင်ရန်</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="username">အသုံးပြုသူအမည်</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="အသုံးပြုသူအမည် ထည့်သွင်းပါ"
            disabled={loading}
          />
          {validationErrors.username && (
            <ErrorMessage>{validationErrors.username}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">စကားဝှက်</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="စကားဝှက် ထည့်သွင်းပါ"
            disabled={loading}
          />
          {validationErrors.password && (
            <ErrorMessage>{validationErrors.password}</ErrorMessage>
          )}
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button
          type="submit"
          variant="gradient"
          disabled={loading}
          fullWidth
        >
          {loading ? 'ဝင်နေသည်...' : 'ဝင်မည်'}
        </Button>
      </Form>

      <RegisterLink to="/register">
        အကောင့်မရှိသေးပါက အကောင့်အသစ်ဖွင့်ရန် နှိပ်ပါ
      </RegisterLink>
    </LoginContainer>
  );
};

export default Login; 