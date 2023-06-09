import { useEffect, useState } from 'react';
import type { FetcherWithComponents } from '@remix-run/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import Form from './Form';
import { Command } from 'cmdk';
import Loading from './Loading';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

type ComboBoxProps<Item> = {
  valueSelector: (item: Item) => string;
  displaySelector: (item: Item) => string;
  endpoint: (search: string) => string;
  fetcher: FetcherWithComponents<Item[]>;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelectionChange?: (item: Item | null) => void;
} & React.ComponentProps<'input'>;

export default function FetcherComboBox<Item>({
  valueSelector,
  displaySelector,
  endpoint,
  fetcher,
  onSelectionChange,
  open,
  onOpenChange,
  trigger,
  name,
  id,
  placeholder = 'Type to search...',
  children,
}: ComboBoxProps<Item>) {
  const { data, load, state } = fetcher;

  const [item, setItem] = useState<Item | null>(null);
  const [_open, _setOpen] = useState(false);

  useEffect(() => {
    if (open !== undefined) _setOpen(open);
  }, [open]);

  useEffect(() => {
    onOpenChange?.(_open);
  }, [_open, onOpenChange]);

  const close = () => _setOpen(false);

  const select = (item: Item) => {
    setItem(item);
    onSelectionChange?.(item);
    close();
  };

  const loading = state !== 'idle';

  return (
    <>
      {name && id ? (
        <Form.Input
          type="hidden"
          name={name}
          id={id}
          value={item ? valueSelector(item) : ''}
        />
      ) : null}

      <DropdownMenu.Root open={_open} onOpenChange={_setOpen}>
        <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="bottom"
            sideOffset={-34}
            className="
              bg-white bg-opacity-70 backdrop-blur-lg
              border border-black border-opacity-10
              py-1 px-2 rounded-md z-20
              w-[var(--radix-dropdown-menu-trigger-width)]
            "
          >
            <Command className="w-full flex flex-col" shouldFilter={false}>
              <div
                className="
                  flex flex-row items-center gap-1 mb-1
                  border-b border-black border-opacity-10
                "
              >
                <MagnifyingGlassIcon className="text-green-500" />

                <Command.Input
                  autoFocus
                  placeholder={placeholder}
                  className="text-sm flex-1 p-1 outline-none bg-transparent"
                  onValueChange={(search) => load(endpoint(search))}
                />

                {loading && <Loading size="sm" className="text-green-500" />}
              </div>

              <Command.List>
                {data?.map((item) => (
                  <Command.Item
                    key={valueSelector(item)}
                    value={valueSelector(item)}
                    className="
                      text-sm px-1.5 py-1 rounded cursor-pointer
                      aria-[selected]:bg-green-500 aria-[selected]:text-white
                    "
                    onSelect={() => select(item)}
                  >
                    {displaySelector(item)}
                  </Command.Item>
                ))}
                {children}
              </Command.List>
            </Command>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
}
