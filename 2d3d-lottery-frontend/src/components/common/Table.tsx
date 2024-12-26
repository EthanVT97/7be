import React from 'react';
import styled, { css } from 'styled-components';

interface Column<T> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  selectedRow?: T;
  stickyHeader?: boolean;
  className?: string;
}

const TableWrapper = styled.div<{ stickyHeader?: boolean }>`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radii.lg};
  
  ${({ stickyHeader }) =>
    stickyHeader &&
    css`
      max-height: 600px;
      overflow-y: auto;
    `}
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const TableHead = styled.thead<{ sticky?: boolean }>`
  background-color: ${({ theme }) => theme.colors.gray100};
  
  ${({ sticky }) =>
    sticky &&
    css`
      position: sticky;
      top: 0;
      z-index: 1;
    `}
`;

const TableHeader = styled.th<{ width?: string; align?: string }>`
  padding: ${({ theme }) => theme.space.md};
  font-weight: 600;
  text-align: ${({ align }) => align || 'left'};
  width: ${({ width }) => width || 'auto'};
  white-space: nowrap;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray200};
`;

const TableBody = styled.tbody`
  background-color: white;
`;

const TableRow = styled.tr<{ clickable?: boolean; selected?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  transition: all 0.2s;

  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
      &:hover {
        background-color: ${({ theme }) => theme.colors.gray50};
      }
    `}

  ${({ selected, theme }) =>
    selected &&
    css`
      background-color: ${theme.colors.primary}10;
    `}

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td<{ align?: string }>`
  padding: ${({ theme }) => theme.space.md};
  text-align: ${({ align }) => align || 'left'};
  white-space: nowrap;
`;

const EmptyMessage = styled.div`
  padding: ${({ theme }) => theme.space.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

function Table<T extends { id?: string | number }>({
  columns,
  data,
  loading,
  emptyMessage = 'No data available',
  onRowClick,
  selectedRow,
  stickyHeader,
  className,
}: TableProps<T>) {
  return (
    <TableWrapper stickyHeader={stickyHeader} className={className}>
      <StyledTable>
        <TableHead sticky={stickyHeader}>
          <tr>
            {columns.map((column, index) => (
              <TableHeader
                key={index}
                width={column.width}
                align={column.align}
              >
                {column.header}
              </TableHeader>
            ))}
          </tr>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyMessage>{emptyMessage}</EmptyMessage>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={row.id || rowIndex}
                clickable={!!onRowClick}
                selected={selectedRow === row}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    align={column.align}
                  >
                    {typeof column.accessor === 'function'
                      ? column.accessor(row)
                      : row[column.accessor]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
      {loading && (
        <LoadingOverlay>
          <div>Loading...</div>
        </LoadingOverlay>
      )}
    </TableWrapper>
  );
}

export default Table; 