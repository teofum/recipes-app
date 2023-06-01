import type { IconProps } from './props';
import { useIconSize } from './useIconSize';

const SvgAddCircle = ({
  size = 'md',
  strokeWidth = 2,
  ...props
}: IconProps) => {
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
      <circle
        fill="none"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        cx="12"
        cy="12"
        r="10"
      />
      <path
        fill="none"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 12h10M12 7v10"
      />
    </svg>
  );
};

export default SvgAddCircle;
