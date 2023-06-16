import React, { createContext, useContext } from 'react';
import cn from 'classnames';

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { useButtonVariants, type ButtonStyleVariant, type ButtonVariants } from './Button';

interface VariantProp {
  variant?: ButtonVariants | ButtonStyleVariant;
}

const VariantContext = createContext<VariantProp>({});

type ToggleGroupProps = VariantProp &
  React.ComponentProps<typeof ToggleGroupPrimitive.Root>;

const Root = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  function ToggleGroup(
    { children, orientation = 'horizontal', variant, className, ...props },
    ref,
  ) {
    return (
      <ToggleGroupPrimitive.Root
        className={cn(
          'flex',
          {
            'flex-row': orientation === 'horizontal',
            'flex-col': orientation === 'vertical',
          },
          className,
        )}
        orientation={orientation}
        ref={ref}
        {...props}
      >
        <VariantContext.Provider value={{ variant }}>
          {children}
        </VariantContext.Provider>
      </ToggleGroupPrimitive.Root>
    );
  },
);

type ToggleItemProps = React.ComponentProps<typeof ToggleGroupPrimitive.Item>;

const Item = React.forwardRef<HTMLButtonElement, ToggleItemProps>(
  function ToggleGroupItem({ children, className, ...props }, ref) {
    const { variant } = useContext(VariantContext);
    const dataAttributes = useButtonVariants(variant);

    return (
      <ToggleGroupPrimitive.Item
        className={cn('button toggle-button', className)}
        ref={ref}
        {...dataAttributes}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Item>
    );
  },
);

export default {
  Root,
  Item,
};
