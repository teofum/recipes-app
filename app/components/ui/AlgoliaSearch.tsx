import { useEffect, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {
  InstantSearch,
  useHits,
  useHitsPerPage,
  useInstantSearch,
  useSearchBox,
} from 'react-instantsearch-hooks';
import type { BaseHit } from 'instantsearch.js';
import { Command } from 'cmdk';

import Loading from './Loading';
import algoliasearch from 'algoliasearch';

const algoliaSearch = algoliasearch(
  'PUMBCMX00G',
  'b14894f130d995b0895ead04b965a70c',
);

interface SearchBoxProps {
  placeholder?: string;
}

function SearchBox({ placeholder = 'Type to search...' }: SearchBoxProps) {
  const { status } = useInstantSearch();
  const { refine } = useSearchBox();

  return (
    <div className="flex flex-row items-center gap-1 mb-1 border-b">
      <MagnifyingGlassIcon className="text-primary" />

      <Command.Input
        autoFocus
        placeholder={placeholder}
        className="text-sm flex-1 p-1 outline-none bg-transparent"
        onValueChange={refine}
      />

      {status === 'stalled' && <Loading size="sm" className="text-primary" />}
    </div>
  );
}

interface HitsProps {
  onSelect?: (hit: BaseHit) => void;
  displayValue: (hit: BaseHit) => React.ReactNode;
}

function Hits({ onSelect, displayValue }: HitsProps) {
  const { hits } = useHits();
  useHitsPerPage({ items: [{ label: '_', value: 4, default: true }] });

  return (
    <Command.List>
      {hits?.map((hit) => {
        return (
          <Command.Item
            key={hit.objectID}
            value={hit.objectID}
            className="
            text-sm px-1.5 py-1 rounded cursor-pointer
            aria-[selected]:bg-primary aria-[selected]:text-white
          "
            onSelect={() => onSelect?.(hit)}
          >
            {displayValue(hit)}
          </Command.Item>
        );
      })}
    </Command.List>
  );
}

type AlgoliaSearchProps = React.PropsWithChildren<{
  indexName: string;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;

function Root({
  indexName,
  trigger,
  open,
  onOpenChange,
  children,
}: AlgoliaSearchProps) {
  const [_open, _setOpen] = useState(false);

  useEffect(() => {
    if (open !== undefined) _setOpen(open);
  }, [open]);

  useEffect(() => {
    onOpenChange?.(_open);
  }, [_open, onOpenChange]);

  return (
    <InstantSearch searchClient={algoliaSearch} indexName={indexName}>
      <DropdownMenu.Root open={_open} onOpenChange={_setOpen}>
        <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="bottom"
            sideOffset={-34}
            className="
              surface border py-1 px-2 rounded-md z-20
              w-[var(--radix-dropdown-menu-trigger-width)]
            "
          >
            <Command className="w-full flex flex-col" shouldFilter={false}>
              {children}
            </Command>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </InstantSearch>
  );
}

export default {
  Root,
  SearchBox,
  Hits,
};
