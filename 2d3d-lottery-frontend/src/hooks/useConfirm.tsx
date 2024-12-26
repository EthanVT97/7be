import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmDialog from '../components/common/ConfirmDialog';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface ConfirmContextData {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextData>({} as ConfirmContextData);

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions | null;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    options: null,
    resolve: null,
  });

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    setState((prev) => {
      if (prev.resolve) {
        prev.resolve(false);
      }
      return {
        isOpen: false,
        options: null,
        resolve: null,
      };
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setState((prev) => {
      if (prev.resolve) {
        prev.resolve(true);
      }
      return {
        isOpen: false,
        options: null,
        resolve: null,
      };
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state.isOpen && state.options && (
        <ConfirmDialog
          isOpen={state.isOpen}
          onClose={handleClose}
          onConfirm={handleConfirm}
          {...state.options}
        />
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context.confirm;
}; 