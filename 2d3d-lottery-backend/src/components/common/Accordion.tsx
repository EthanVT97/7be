import React, { useState } from 'react';
import styled, { css } from 'styled-components';

interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  onChange?: (expandedIds: string[]) => void;
  className?: string;
}

const AccordionContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`;

const AccordionItemContainer = styled.div<{ isLast: boolean }>`
  border-bottom: ${({ isLast, theme }) =>
    isLast ? 'none' : `1px solid ${theme.colors.gray200}`};
`;

const AccordionHeader = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  background: none;
  border: none;
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray50};
  }

  &:focus {
    outline: none;
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;

const AccordionIcon = styled.span<{ isExpanded: boolean }>`
  margin-left: ${({ theme }) => theme.space.sm};
  transition: transform 0.2s;
  transform: ${({ isExpanded }) => (isExpanded ? 'rotate(180deg)' : 'rotate(0)')};
`;

const AccordionContent = styled.div<{ isExpanded: boolean }>`
  padding: ${({ theme, isExpanded }) =>
    isExpanded ? theme.space.md : '0 ' + theme.space.md};
  background-color: white;
  overflow: hidden;
  transition: all 0.3s;
  max-height: ${({ isExpanded }) => (isExpanded ? '1000px' : '0')};
  opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
`;

const AccordionItemTitle = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.dark};
`;

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  onChange,
  className,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);

  const handleItemClick = (itemId: string) => {
    let newExpandedItems: string[];

    if (allowMultiple) {
      newExpandedItems = expandedItems.includes(itemId)
        ? expandedItems.filter((id) => id !== itemId)
        : [...expandedItems, itemId];
    } else {
      newExpandedItems = expandedItems.includes(itemId) ? [] : [itemId];
    }

    setExpandedItems(newExpandedItems);
    onChange?.(newExpandedItems);
  };

  return (
    <AccordionContainer className={className}>
      {items.map((item, index) => {
        const isExpanded = expandedItems.includes(item.id);
        const isLast = index === items.length - 1;

        return (
          <AccordionItemContainer key={item.id} isLast={isLast}>
            <AccordionHeader
              onClick={() => !item.disabled && handleItemClick(item.id)}
              disabled={item.disabled}
              aria-expanded={isExpanded}
            >
              <AccordionItemTitle>{item.title}</AccordionItemTitle>
              <AccordionIcon isExpanded={isExpanded}>▼</AccordionIcon>
            </AccordionHeader>
            <AccordionContent isExpanded={isExpanded}>
              {item.content}
            </AccordionContent>
          </AccordionItemContainer>
        );
      })}
    </AccordionContainer>
  );
};

export default Accordion; 