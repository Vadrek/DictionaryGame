import classNames from 'classnames';
import React, { FC, PropsWithChildren } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export type ButtonSize = 'x-small' | 'small' | 'medium' | 'large';

type ButtonVariationProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
};
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariationProps & {
    type?: 'button' | 'submit' | 'reset';
  };

function getButtonClassName({
  variant = 'primary',
  size = 'medium',
}: ButtonVariationProps): string {
  return classNames(
    'bg-gradient-to-b font-bold rounded-lg shadow-lg border-4 border-black hover:from-blue-500 hover:to-blue-700 active:translate-y-1 active:shadow-inner transition-all duration-150',
    {
      'from-yellow-400 to-yellow-600 text-black': variant === 'primary',
      'from-blue-400 to-blue-600 text-white': variant === 'secondary',
      'from-red-400 to-red-600 text-white': variant === 'danger',
      'px-6 py-3': size === 'large',
      'px-4 py-2': size === 'medium',
      'px-2 py-1': size === 'small',
    },
  );
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  type,
  variant,
  size,
  ...commonProps
}) => {
  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={getButtonClassName({ variant, size })}
      {...commonProps}
    >
      {children}
    </button>
  );
};
