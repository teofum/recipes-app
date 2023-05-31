import { useEffect, useRef, useState } from 'react';
import Form from './Form';
import Select from './Select';
import type { FetcherWithComponents } from '@remix-run/react';

const allowedKeys = ['ArrowDown', 'Escape'];

type ComboBoxProps<Item> = {
  valueSelector: (item: Item) => string;
  displaySelector: (item: Item) => string;
  endpoint: (search: string) => string;
  fetcher: FetcherWithComponents<Item[]>;
  maxResults?: number;
} & React.ComponentProps<typeof Form.Select>;

export default function FetcherComboBox<Item>({
  valueSelector,
  displaySelector,
  endpoint,
  fetcher,
  maxResults = 5,
  contentProps,
  placeholder,
  ...props
}: ComboBoxProps<Item>) {
  const { data, load } = fetcher;

  /**
   * Steal focus away from the Radix select component, which autofocuses the
   * selected element whenever data changes, making the input lose focus if the
   * selected item appears or disappears from the available items
   */
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTimeout(() => input.current?.focus(), 0);
  }, [data]);

  const [item, setItem] = useState<Item>();

  const value = item ? valueSelector(item) : '';
  const setValue = (value: string) =>
    setItem(data?.find((item) => valueSelector(item) === value));

  const displayValue = item ? displaySelector(item) : placeholder;

  return (
    <Form.Select
      contentProps={{
        position: 'popper',
        side: 'bottom',
        sideOffset: -34,
        className: 'w-[var(--radix-select-trigger-width)]',
        ...contentProps,
      }}
      value={value}
      onValueChange={setValue}
      onOpenChange={(open) => {
        if (open) setTimeout(() => input.current?.focus(), 0);
      }}
      renderValue={displayValue}
      {...props}
    >
      <input
        className="
          text-sm
          bg-stone-50
          border border-black border-opacity-20
          rounded
          px-2 py-[0.1875rem] mb-1 w-full last:mb-0
          outline-none outline-offset-0
          focus-visible:border-green-500 focus-visible:bg-green-50
          aria-[invalid]:border-red-500 aria-[invalid]:bg-red-50
          transition
        "
        onKeyDown={(ev) => {
          if (!allowedKeys.includes(ev.key)) ev.stopPropagation();
        }}
        onChange={(ev) => load(endpoint(ev.target.value))}
        ref={input}
      />

      {data?.map((item) => (
        <Select.Item key={valueSelector(item)} value={valueSelector(item)}>
          {displaySelector(item)}
        </Select.Item>
      ))}
    </Form.Select>
  );
}
