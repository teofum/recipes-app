import React from 'react';
import { useMemo } from 'react';
import { Link } from '@remix-run/react';
import cn from 'classnames';

import type { ElementProps } from '~/utils/ElementProps.type';

export type ButtonTypeVariant = 'text' | 'icon';
export type ButtonSizeVariant = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonStyleVariant = 'text' | 'outlined' | 'filled' | 'heavy';
export type ButtonColorVariant = 'default' | 'warning' | 'danger' | 'neutral';

export interface ButtonVariants {
  type?: ButtonTypeVariant;
  size?: ButtonSizeVariant;
  style?: ButtonStyleVariant;
  color?: ButtonColorVariant;
}

const defaultVariants: Required<ButtonVariants> = {
  type: 'text',
  size: 'md',
  style: 'text',
  color: 'default',
};

export function useButtonVariants(
  variant?: ButtonVariants | ButtonStyleVariant,
) {
  const dataAttributes = useMemo(() => {
    const userVars = typeof variant === 'string' ? { style: variant } : variant;
    const variants: { [key: string]: string } = {
      ...defaultVariants,
      ...userVars,
    };

    const data: { [key: string]: string } = {};
    Object.keys(variants).forEach((key) => {
      data[`data-variant-${key}`] = variants[key];
    });

    return data;
  }, [variant]);

  return dataAttributes;
}

interface BaseProps {
  variant?: ButtonVariants | ButtonStyleVariant;
}

type ButtonProps = BaseProps & ElementProps<'button'>;
type LinkButtonProps = BaseProps & React.ComponentProps<typeof Link>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, children, variant, ...props },
  ref,
) {
  const dataAttributes = useButtonVariants(variant);

  return (
    <button
      ref={ref}
      className={cn('button', className)}
      {...dataAttributes}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  function LinkButton({ className, children, variant, ...props }, ref) {
    const dataAttributes = useButtonVariants(variant);

    return (
      <Link
        ref={ref}
        className={cn('button', className)}
        {...dataAttributes}
        {...props}
      >
        {children}
      </Link>
    );
  },
);
