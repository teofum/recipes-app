import cn from 'classnames';
import type { ElementProps } from '~/utils/ElementProps.type';

type ButtonProps = {
  contentClassName?: string;
} & ElementProps<'button'>;

export default function Button({
  className,
  contentClassName,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        `
        group
        bg-current
        rounded-md
        outline-none
        focus-visible:outline-offset-0 focus-visible:outline-2
        focus-visible:outline-green-500
        disabled:text-stone-500 disabled:cursor-not-allowed
        `,
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          `
          flex flex-row items-center justify-center
          bg-green-300
          border-2 border-current
          rounded-md
          p-2
          h-11
          -translate-y-1
          group-hover:-translate-y-[5px]
          group-active:-translate-y-[3px]
          group-focus-visible:bg-green-400
          group-disabled:bg-green-100 group-disabled:-translate-y-1
          `,
          contentClassName,
        )}
      >
        {children}
      </div>
    </button>
  );
}
