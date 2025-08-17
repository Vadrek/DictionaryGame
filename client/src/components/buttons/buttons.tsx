import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export type ButtonSize = 'x-small' | 'small' | 'medium' | 'large';

type ButtonVariationProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
};
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariationProps & {
    type?: 'button' | 'submit' | 'reset';
  };

function getButtonClassName({
  variant = 'primary',
  size = 'medium',
  disabled,
}: ButtonVariationProps): string {
  return classNames(
    'h-fit bg-gradient-to-b font-bold rounded-lg shadow-lg border-4 border-black active:translate-y-1 active:shadow-inner transition-all duration-150',
    {
      'from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700':
        !disabled && variant === 'primary',
      'from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700':
        !disabled && variant === 'secondary',
      'from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700':
        !disabled && variant === 'danger',
      'px-6 py-3': size === 'large',
      'px-4 py-2': size === 'medium',
      'px-2 py-1': size === 'small',
      'bg-gray-400 cursor-not-allowed': disabled,
    },
  );
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  type,
  variant,
  size,
  disabled,
  className,
  ...commonProps
}) => {
  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={classNames(
        getButtonClassName({ variant, size, disabled }),
        className,
      )}
      {...commonProps}
    >
      {children}
    </button>
  );
};
