import * as Select from '@radix-ui/react-select';
import cn from 'classnames';
import React from 'react';
import {
  CaretDownIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';

type RootProps = {
  placeholder?: string;
  triggerProps?: React.ComponentProps<typeof Select.Trigger>;
  contentProps?: React.ComponentProps<typeof Select.Content>;
  renderValue?: React.ReactNode;
} & React.ComponentProps<typeof Select.Root>;

function Root({
  children,
  triggerProps,
  contentProps,
  placeholder,
  renderValue,
  ...props
}: RootProps) {
  return (
    <Select.Root {...props}>
      <Select.Trigger
        className={cn(
          `
          input whitespace-nowrap overflow-hidden text-ellipsis
          flex flex-row justify-between items-center gap-2 min-h-[2.125rem]
          `,
          triggerProps?.className,
        )}
      >
        <Select.Value placeholder={placeholder ?? 'Select an option'}>
          {renderValue}
        </Select.Value>
        <Select.Icon>
          <CaretDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          {...contentProps}
          className={cn(
            'surface border rounded-md p-1 z-20',
            contentProps?.className,
          )}
        >
          <Select.ScrollUpButton>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport>{children}</Select.Viewport>
          <Select.ScrollDownButton>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

const Item = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Select.Item>
>(function Item({ value, className, children, ...props }, ref) {
  return (
    <Select.Item
      className={cn(
        `
        flex flex-row justify-between items-center gap-2
        text-sm
        rounded
        px-1 py-0.5
        outline-none outline-offset-0
        cursor-pointer
        focus-visible:bg-primary-5 focus-visible:text-primary-high
        hover:bg-primary-5 hover:text-primary-high
        `,
        className,
      )}
      value={value}
      ref={ref}
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator>
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

export default {
  Root,
  Item,
};
