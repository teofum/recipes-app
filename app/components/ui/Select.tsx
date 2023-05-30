import * as Select from '@radix-ui/react-select';
import cn from 'classnames';
import React from 'react';

type RootProps = {
  triggerProps?: React.ComponentProps<typeof Select.Trigger>;
  contentProps?: React.ComponentProps<typeof Select.Content>;
} & React.ComponentProps<typeof Select.Root>;

function Root({ children, triggerProps, contentProps, ...props }: RootProps) {
  return (
    <Select.Root {...props}>
      <Select.Trigger
        className={cn(
          `
          flex flex-row justify-between items-center gap-2
          text-sm
          bg-stone-50
          border border-black border-opacity-20
          rounded-md
          p-2
          outline-none outline-offset-0
          focus-visible:border-green-500 focus-visible:bg-green-50
          aria-[invalid]:border-red-500 aria-[invalid]:bg-red-50
          transition
          `,
          triggerProps?.className,
        )}
      >
        <Select.Value />
        <Select.Icon>v</Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          {...contentProps}
          className={cn(
            `
            bg-white
            border border-black border-opacity-20
            rounded-md
            p-1
            `,
            contentProps?.className,
          )}
        >
          <Select.ScrollUpButton>u</Select.ScrollUpButton>
          <Select.Viewport>{children}</Select.Viewport>
          <Select.ScrollDownButton>d</Select.ScrollDownButton>
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
        focus-visible:bg-green-500 focus-visible:text-white
        hover:bg-green-500 hover:text-white
        `,
        className,
      )}
      value={value}
      ref={ref}
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator>c</Select.ItemIndicator>
    </Select.Item>
  );
});

export default {
  Root,
  Item,
};
