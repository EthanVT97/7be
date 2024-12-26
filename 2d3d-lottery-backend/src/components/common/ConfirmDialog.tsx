import React from 'react';
import styled from 'styled-components';
import ModalWrapper from '../modals/ModalWrapper';
import { Button } from '../modals/styles';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const DialogContent = styled.div`
  padding: 1rem 0;
`;

const Message = styled.p`
  margin: 0 0 1.5rem;
  color: #495057;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const getButtonVariant = (type: string, isConfirm: boolean) => {
  if (isConfirm) {
    switch (type) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      default:
        return 'primary';
    }
  }
  return undefined;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  isLoading = false
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      isLoading={isLoading}
      maxWidth="400px"
      showCloseButton={false}
    >
      <DialogContent>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            variant={getButtonVariant(type, true)}
          >
            {confirmText}
          </Button>
        </ButtonGroup>
      </DialogContent>
    </ModalWrapper>
  );
};

export default ConfirmDialog; 