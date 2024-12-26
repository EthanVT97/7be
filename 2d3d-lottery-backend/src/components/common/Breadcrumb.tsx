import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  className?: string;
}

const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const BreadcrumbList = styled.ol`
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;

  &:last-child {
    a, span {
      color: ${({ theme }) => theme.colors.dark};
      font-weight: 500;
      pointer-events: none;
    }
  }
`;

const itemStyles = css`
  color: ${({ theme }) => theme.colors.gray};
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const BreadcrumbLink = styled(Link)`
  ${itemStyles}
`;

const BreadcrumbText = styled.span`
  ${itemStyles}
`;

const Separator = styled.span`
  margin: 0 ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.gray};
  user-select: none;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-right: ${({ theme }) => theme.space.xs};
`;

const Ellipsis = styled.span`
  margin: 0 ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.gray};
`;

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  maxItems = 0,
  className,
}) => {
  const renderItems = () => {
    if (maxItems && items.length > maxItems) {
      const firstItem = items[0];
      const lastItems = items.slice(-2);

      return (
        <>
          <BreadcrumbItem>
            {firstItem.href ? (
              <BreadcrumbLink to={firstItem.href}>
                {firstItem.icon && (
                  <IconWrapper>{firstItem.icon}</IconWrapper>
                )}
                {firstItem.label}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbText>
                {firstItem.icon && (
                  <IconWrapper>{firstItem.icon}</IconWrapper>
                )}
                {firstItem.label}
              </BreadcrumbText>
            )}
            <Separator>{separator}</Separator>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Ellipsis>...</Ellipsis>
            <Separator>{separator}</Separator>
          </BreadcrumbItem>
          {lastItems.map((item, index) => (
            <BreadcrumbItem key={index}>
              {item.href ? (
                <BreadcrumbLink to={item.href}>
                  {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbText>
                  {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
                  {item.label}
                </BreadcrumbText>
              )}
              {index < lastItems.length - 1 && (
                <Separator>{separator}</Separator>
              )}
            </BreadcrumbItem>
          ))}
        </>
      );
    }

    return items.map((item, index) => (
      <BreadcrumbItem key={index}>
        {item.href ? (
          <BreadcrumbLink to={item.href}>
            {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
            {item.label}
          </BreadcrumbLink>
        ) : (
          <BreadcrumbText>
            {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
            {item.label}
          </BreadcrumbText>
        )}
        {index < items.length - 1 && <Separator>{separator}</Separator>}
      </BreadcrumbItem>
    ));
  };

  return (
    <BreadcrumbContainer className={className}>
      <BreadcrumbList>{renderItems()}</BreadcrumbList>
    </BreadcrumbContainer>
  );
};

export default Breadcrumb; 