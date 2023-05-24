import type { IconProps } from './props';

const sizes = {
  sm: 20,
  md: 24,
  lg: 32,
};

export function useIconSize(size: IconProps['size']) {
  return (typeof size === 'string' ? sizes[size] : size) ?? 24;
}
