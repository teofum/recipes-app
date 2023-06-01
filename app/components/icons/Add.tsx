import type { IconProps } from './props';
import { useIconSize } from './useIconSize';

const SvgAdd = ({ size = 'md', strokeWidth = 2, ...props }: IconProps) => {
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
        d="M19 12H5M12 5v14"
      />
    </svg>
  );
};

export default SvgAdd;
