import { Link } from '@remix-run/react';
import cn from 'classnames';
import type { ElementProps } from '~/utils/ElementProps.type';
import type { Check } from '../icons';

const BUTTON_CLASSNAMES = `
  group
  text-sm text-white
  bg-green-800
  rounded-md
  outline-none
  focus-visible:outline-offset-0 focus-visible:outline-2
  focus-visible:outline-green-500
  disabled:opacity-50 disabled:cursor-not-allowed
`;
const CONTENT_CLASSNAMES = `
  flex flex-row items-center justify-center
  bg-green-700
  border border-green-800
  rounded-md
  p-2
  h-8
  -translate-y-[2px]
  group-hover:-translate-y-[3px]
  group-active:-translate-y-[1px]
  group-focus-visible:bg-green-600
  group-disabled:-translate-y-[2px]
`;

interface BaseProps {
  contentClassName?: string;
}

type ButtonProps = BaseProps & ElementProps<'button'>;
type LinkButtonProps = BaseProps & React.ComponentProps<typeof Link>;

export default function Button({
  className,
  contentClassName,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(BUTTON_CLASSNAMES, className)} {...props}>
      <div className={cn(CONTENT_CLASSNAMES, contentClassName)}>{children}</div>
    </button>
  );
}

export function LinkButton({
  className,
  contentClassName,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={cn(BUTTON_CLASSNAMES, className)} {...props}>
      <div className={cn(CONTENT_CLASSNAMES, contentClassName)}>{children}</div>
    </Link>
  );
}

type IconButtonProps<T extends ButtonProps | LinkButtonProps> = {
  Icon: typeof Check;
} & Omit<T, 'children'>;

export function IconButton({ Icon, ...props }: IconButtonProps<ButtonProps>) {
  return (
    <Button {...props}>
      <Icon size="sm" />
    </Button>
  );
}

export function IconLinkButton({
  Icon,
  ...props
}: IconButtonProps<LinkButtonProps>) {
  return (
    <LinkButton {...props}>
      <Icon size="sm" />
    </LinkButton>
  );
}
