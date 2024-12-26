import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getGameSettings, updateGameSettings, setGameResult } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useConfirm } from '../../hooks/useConfirm';

interface GameSettings {
  id: string;
  type: '2D' | '3D';
  isEnabled: boolean;
  closeBefore: number; // minutes
  nextDrawTime: string;
  lastResult?: string;
  lastDrawTime?: string;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: #495057;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }

  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
`;

const Button = styled.button<{ variant?: 'success' | 'danger' }>`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${props => 
    props.variant === 'success' ? '#28a745' : 
    props.variant === 'danger' ? '#dc3545' : 
    '#007bff'};
  color: white;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #28a745;
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const ResultDisplay = styled.div`
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const GameManagement: React.FC = () => {
  const [settings, setSettings] = useState<GameSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{ [key: string]: string }>({});
  
  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await getGameSettings();
      setSettings(response.data);
    } catch (error) {
      toast.showToast('Failed to fetch game settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGame = async (gameId: string, currentStatus: boolean) => {
    const gameType = settings.find(s => s.id === gameId)?.type;
    const confirmed = await confirm({
      title: `${currentStatus ? 'Disable' : 'Enable'} ${gameType}`,
      message: `Are you sure you want to ${currentStatus ? 'disable' : 'enable'} ${gameType} lottery?`,
      confirmText: 'Yes',
      cancelText: 'No',
      type: 'warning'
    });

    if (!confirmed) return;

    try {
      await updateGameSettings(gameId, { isEnabled: !currentStatus });
      setSettings(settings.map(setting => 
        setting.id === gameId ? { ...setting, isEnabled: !currentStatus } : setting
      ));
      toast.showToast(`${gameType} lottery ${currentStatus ? 'disabled' : 'enabled'} successfully`, 'success');
    } catch (error) {
      toast.showToast(`Failed to ${currentStatus ? 'disable' : 'enable'} ${gameType} lottery`, 'error');
    }
  };

  const handleUpdateSettings = async (gameId: string, closeBefore: number, nextDrawTime: string) => {
    const gameType = settings.find(s => s.id === gameId)?.type;
    try {
      await updateGameSettings(gameId, { closeBefore, nextDrawTime });
      setSettings(settings.map(setting => 
        setting.id === gameId ? { ...setting, closeBefore, nextDrawTime } : setting
      ));
      toast.showToast(`${gameType} settings updated successfully`, 'success');
    } catch (error) {
      toast.showToast(`Failed to update ${gameType} settings`, 'error');
    }
  };

  const handleSetResult = async (gameId: string, result: string) => {
    const gameType = settings.find(s => s.id === gameId)?.type;
    const confirmed = await confirm({
      title: `Set ${gameType} Result`,
      message: `Are you sure you want to set ${result} as the result for ${gameType}?`,
      confirmText: 'Yes',
      cancelText: 'No',
      type: 'warning'
    });

    if (!confirmed) return;

    try {
      await setGameResult(gameId, result);
      setSettings(settings.map(setting => 
        setting.id === gameId ? { ...setting, lastResult: result, lastDrawTime: new Date().toISOString() } : setting
      ));
      setResults({ ...results, [gameId]: '' });
      toast.showToast(`${gameType} result set successfully`, 'success');
    } catch (error) {
      toast.showToast(`Failed to set ${gameType} result`, 'error');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      {settings.map(setting => (
        <Card key={setting.id}>
          <Title>{setting.type} Management</Title>
          
          <Form onSubmit={e => {
            e.preventDefault();
            handleUpdateSettings(
              setting.id,
              setting.closeBefore,
              setting.nextDrawTime
            );
          }}>
            <FormGroup>
              <Label>Enable/Disable Game</Label>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  checked={setting.isEnabled}
                  onChange={() => handleToggleGame(setting.id, setting.isEnabled)}
                />
                <ToggleSlider />
              </Toggle>
            </FormGroup>

            <FormGroup>
              <Label>Close Before (minutes)</Label>
              <Input
                type="number"
                value={setting.closeBefore}
                onChange={e => setSettings(settings.map(s => 
                  s.id === setting.id ? { ...s, closeBefore: Number(e.target.value) } : s
                ))}
                min={1}
              />
            </FormGroup>

            <FormGroup>
              <Label>Next Draw Time</Label>
              <Input
                type="datetime-local"
                value={setting.nextDrawTime.slice(0, 16)}
                onChange={e => setSettings(settings.map(s => 
                  s.id === setting.id ? { ...s, nextDrawTime: e.target.value } : s
                ))}
              />
            </FormGroup>

            <Button type="submit">
              Update Settings
            </Button>
          </Form>

          {setting.lastResult && (
            <ResultDisplay>
              <Label>Last Result: {setting.lastResult}</Label>
              <br />
              <Label>Draw Time: {new Date(setting.lastDrawTime!).toLocaleString()}</Label>
            </ResultDisplay>
          )}

          <FormGroup>
            <Label>Set Result</Label>
            <Input
              type="text"
              value={results[setting.id] || ''}
              onChange={e => setResults({ ...results, [setting.id]: e.target.value })}
              placeholder={`Enter ${setting.type} result`}
              pattern={setting.type === '2D' ? '[0-9]{2}' : '[0-9]{3}'}
              maxLength={setting.type === '2D' ? 2 : 3}
            />
            <Button
              onClick={() => handleSetResult(setting.id, results[setting.id])}
              disabled={!results[setting.id] || (
                setting.type === '2D' ? !/^[0-9]{2}$/.test(results[setting.id]) :
                !/^[0-9]{3}$/.test(results[setting.id])
              )}
            >
              Set Result
            </Button>
          </FormGroup>
        </Card>
      ))}
    </Container>
  );
};

export default GameManagement; 