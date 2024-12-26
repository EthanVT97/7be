import React from 'react';
import styled, { css } from 'styled-components';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
`;

const PageButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: white;
  color: ${({ theme }) => theme.colors.dark};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray100};
    border-color: ${({ theme }) => theme.colors.gray300};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ active, theme }) =>
    active &&
    css`
      background-color: ${theme.colors.primary};
      border-color: ${theme.colors.primary};
      color: white;

      &:hover {
        background-color: ${theme.colors.primaryDark};
        border-color: ${theme.colors.primaryDark};
      }
    `}
`;

const Ellipsis = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  padding: ${({ theme }) => theme.space.xs};
`;

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}) => {
  const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  };

  const generatePagination = () => {
    const totalNumbers = siblingCount * 2 + 3; // siblings + first + current + last
    const totalBlocks = totalNumbers + 2; // + 2 for dots

    if (totalPages <= totalBlocks) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, '...', ...middleRange, '...', totalPages];
    }
  };

  const pages = generatePagination();

  if (!pages || pages.length < 2) return null;

  return (
    <PaginationWrapper className={className}>
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ←
      </PageButton>

      {pages.map((page, index) => {
        if (page === '...') {
          return <Ellipsis key={index}>...</Ellipsis>;
        }

        return (
          <PageButton
            key={index}
            active={page === currentPage}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </PageButton>
        );
      })}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </PageButton>
    </PaginationWrapper>
  );
};

export default Pagination; 