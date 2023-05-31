import { Link } from '@remix-run/react';
import cn from 'classnames';
import type { ElementProps } from '~/utils/ElementProps.type';
import { useMemo } from 'react';

type ButtonTypeVariant = 'text' | 'icon';
type ButtonSizeVariant = 'sm' | 'md' | 'lg';
type ButtonStyleVariant = 'text' | 'outlined' | 'filled' | 'heavy';
type ButtonColorVariant = 'default' | 'warning' | 'danger' | 'neutral';

interface ButtonVariants {
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

function useVariants(variant?: ButtonVariants | ButtonStyleVariant) {
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

export default function Button({
  className,
  children,
  variant,
  ...props
}: ButtonProps) {
  const dataAttributes = useVariants(variant);

  return (
    <button className={cn('button', className)} {...dataAttributes} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  className,
  children,
  variant,
  ...props
}: LinkButtonProps) {
  const dataAttributes = useVariants(variant);

  return (
    <Link className={cn('button', className)} {...dataAttributes} {...props}>
      {children}
    </Link>
  );
}
