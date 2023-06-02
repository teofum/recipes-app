import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Form from './Form';
import Select from './Select';
import type { FetcherWithComponents } from '@remix-run/react';
import Loading from './Loading';

const allowedKeys = ['ArrowDown', 'Escape'];

/**
 * Context, used to pass value/control/available data to children
 */
interface FetcherComboBoxContextType<Item> {
  item: Item | undefined;
  setItem: React.Dispatch<React.SetStateAction<Item | undefined>>;

  data: Item[] | undefined;
  state: 'idle' | 'submitting' | 'loading';
  dirty: boolean;

  close: () => void;
}

const FetcherComboBoxContext = createContext<FetcherComboBoxContextType<any>>({
  item: undefined,
  setItem: () => {},
  data: undefined,
  state: 'idle',
  dirty: false,
  close: () => {},
});

function FetcherComboBoxProvider<T>({
  children,
  ...props
}: React.PropsWithChildren<FetcherComboBoxContextType<T>>) {
  return (
    <FetcherComboBoxContext.Provider value={{ ...props }}>
      {children}
    </FetcherComboBoxContext.Provider>
  );
}

export function useFetcherComboBox<T>() {
  const context = useContext(FetcherComboBoxContext);
  if (!context) throw new Error('FetcherComboBox context not available');

  return context as FetcherComboBoxContextType<T>;
}

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
  children,
  ...props
}: ComboBoxProps<Item>) {
  const { data, load, state } = fetcher;

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
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);

  const value = item ? valueSelector(item) : '';
  const setValue = (value: string) => {
    setItem(data?.find((item) => valueSelector(item) === value));
  };

  const displayValue = item ? displaySelector(item) : placeholder;

  const close = useCallback(() => setOpen(false), [setOpen]);

  return (
    <Form.Select
      contentProps={{
        position: 'popper',
        side: 'bottom',
        sideOffset: -34,
        className: 'relative w-[var(--radix-select-trigger-width)]',
        ...contentProps,
      }}
      validationBehavior={{ initial: 'onChange' }}
      value={value}
      onValueChange={(value) => {
        if (open) setValue(value);
      }}
      open={open}
      onOpenChange={(open) => {
        if (open) {
          setDirty(false);
          setTimeout(() => input.current?.focus(), 0);
        }
        setOpen(open);
      }}
      renderValue={displayValue}
      {...props}
    >
      <input
        className="
          text-sm
          bg-stone-50
          border border-black border-opacity-10
          rounded
          pl-2 pr-10 py-0.5 w-full
          outline-none outline-offset-0
          focus-visible:border-green-500 focus-visible:bg-green-50
          aria-[invalid]:border-red-500 aria-[invalid]:bg-red-50
          transition
        "
        onKeyDown={(ev) => {
          if (!allowedKeys.includes(ev.key)) ev.stopPropagation();
        }}
        onChange={(ev) => {
          setDirty(true);
          load(endpoint(ev.target.value));
        }}
        ref={input}
      />

      {data?.map((item) => (
        <Select.Item
          key={valueSelector(item)}
          value={valueSelector(item)}
          className="first-of-type:mt-1"
        >
          {displaySelector(item)}
        </Select.Item>
      ))}

      {state !== 'idle' && (
        <Loading
          size="sm"
          className="absolute top-[5px] right-2 text-green-500"
        />
      )}

      <FetcherComboBoxProvider
        item={item}
        setItem={setItem}
        data={data}
        state={state}
        dirty={dirty}
        close={close}
      >
        {children}
      </FetcherComboBoxProvider>
    </Form.Select>
  );
}
