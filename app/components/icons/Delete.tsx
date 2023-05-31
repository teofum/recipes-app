import type { IconProps } from './props';
import { useIconSize } from './useIconSize';

const SvgDelete = ({ size = 'md', strokeWidth = 2, ...props }: IconProps) => {
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
        d="M10 3h4M5 6h0c.64-.64 1.509-1 2.414-1h9.172c.906 0 1.774.36 2.414 1h0M7 7v13c0 .552.448 1 1 1h8c.552 0 1-.448 1-1V7m-3 1v10M10 8v10"
      />
    </svg>
  );
};

export default SvgDelete;
