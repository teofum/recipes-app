import type { IconProps } from './props';
import { useIconSize } from './useIconSize';

const SvgCheck = ({ size = 'md', strokeWidth = 2, ...props }: IconProps) => {
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
        d="m18 15-6-6-6 6"
      />
    </svg>
  );
};

export default SvgCheck;
