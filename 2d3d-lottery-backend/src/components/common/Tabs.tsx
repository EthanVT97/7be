import React from 'react';
import styled, { css } from 'styled-components';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  className?: string;
}

const TabsContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

const TabList = styled.div<{ variant: string; fullWidth?: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.space.xs};
  border-bottom: ${({ variant, theme }) =>
    variant === 'underline' ? `2px solid ${theme.colors.gray200}` : 'none'};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

const TabButton = styled.button<{
  active: boolean;
  variant: string;
  fullWidth?: boolean;
}>`
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  border: none;
  background: none;
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.gray};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ variant, active, theme }) => {
    switch (variant) {
      case 'pills':
        return css`
          border-radius: ${theme.radii.full};
          background-color: ${active
            ? theme.colors.primary
            : 'transparent'};
          color: ${active ? 'white' : theme.colors.gray};

          &:hover:not(:disabled) {
            background-color: ${active
              ? theme.colors.primaryDark
              : theme.colors.gray100};
          }
        `;
      case 'underline':
        return css`
          position: relative;
          padding-bottom: calc(${theme.space.sm} + 2px);
          margin-bottom: -2px;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: ${active
              ? theme.colors.primary
              : 'transparent'};
            transition: background-color 0.2s;
          }

          &:hover:not(:disabled) {
            color: ${theme.colors.primary};
          }
        `;
      default:
        return css`
          border-radius: ${theme.radii.md};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray100};
          }
        `;
    }
  }}
`;

const TabContent = styled.div`
  padding: ${({ theme }) => theme.space.md} 0;
`;

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  fullWidth = false,
  className,
}) => {
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <TabsContainer fullWidth={fullWidth} className={className}>
      <TabList variant={variant} fullWidth={fullWidth}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={tab.id === activeTab}
            variant={variant}
            fullWidth={fullWidth}
            onClick={() => onTabChange(tab.id)}
            disabled={tab.disabled}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabList>
      <TabContent>{activeTabData?.content}</TabContent>
    </TabsContainer>
  );
};

export default Tabs; 