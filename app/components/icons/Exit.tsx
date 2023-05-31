import type { IconProps } from './props';
import { useIconSize } from './useIconSize';

const SvgExit = ({ size = 'md', strokeWidth = 2, ...props }: IconProps) => {
  const s = useIconSize(size);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={s}
      height={s}
      strokeWidth={strokeWidth}
      {...props}
    >
      <path
        fill="none"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 3h7c1.105 0 2 .895 2 2v16h-3m-7-8-1 4H4"
      />
      <path
        fill="none"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m13 21-3-8 2-5 2 3h2m-7 2 2-5m-4.5 3L8 8h4"
      />
      <circle
        fill="currentcolor"
        stroke="none"
        cx="12.5"
        cy="5.5"
        r="1.5"
      />
    </svg>
  );
};

export default SvgExit;
