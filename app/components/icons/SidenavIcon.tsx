import React from 'react';
import type { IconProps } from './types';

export const SidenavIcon = React.forwardRef<SVGSVGElement, IconProps>(
  function SidenavSvg({ color = 'currentColor', ...props }, forwardedRef) {
    return (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <path
          d="M6 2v11h6.5a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-.5-.5H6ZM2.5 2H5v11H2.5a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5Zm0-1A1.5 1.5 0 0 0 1 2.5v10A1.5 1.5 0 0 0 2.5 14h10a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 12.5 1h-10Z"
          fill={color}
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    );
  }
);

export default SidenavIcon;