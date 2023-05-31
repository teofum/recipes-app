import type { IconProps } from './props';
import { useIconSize } from './useIconSize';

const SvgExitAlt = ({ size = 'md', strokeWidth = 2, ...props }: IconProps) => {
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
        d="M11 3h6c1.105 0 2 .895 2 2v14c0 1.105-.895 2-2 2h-6"
      />
      <path
        fill="none"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11 8 4 4-4 4m-6-4h10"
      />
    </svg>
  );
};

export default SvgExitAlt;
