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
          flex flex-row justify-between items-center gap-2
          text-sm whitespace-nowrap overflow-hidden text-ellipsis
          bg-stone-50
          border border-black border-opacity-10
          rounded-md
          px-2 py-1.5 min-h-[2.125rem]
          outline-none outline-offset-0
          focus-visible:border-green-500 focus-visible:bg-green-50
          aria-[invalid]:border-red-500 aria-[invalid]:bg-red-50
          transition
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
            `
            bg-white
            border border-black border-opacity-10
            rounded-md
            p-1
            `,
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
        focus-visible:bg-green-50 focus-visible:text-green-700
        hover:bg-green-50 hover:text-green-700
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
