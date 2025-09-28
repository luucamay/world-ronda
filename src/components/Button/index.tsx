'use client';

import { Button as UIKitButton } from '@worldcoin/mini-apps-ui-kit-react';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const Button = ({ children, onClick, variant = 'primary', size = 'sm', className, disabled }: ButtonProps) => {
  return (
    <UIKitButton
      variant={variant}
      size={size}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </UIKitButton>
  );
};