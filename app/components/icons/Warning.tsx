import type { IconProps } from './props';
import { useIconSize } from './useIconSize';

const SvgWarning = ({ size = 'md', strokeWidth = 2, ...props }: IconProps) => {
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
        d="M12 8v7m0 3.005V18M10.499 2.893 2.225 18.498C1.623 19.633 2.446 21 3.73 21h16.548c1.284 0 2.107-1.367 1.505-2.502L13.51 2.893c-.64-1.208-2.37-1.208-3.011 0Z"
      />
    </svg>
  );
};

export default SvgWarning;
