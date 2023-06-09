import { useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { PlusCircledIcon, PlusIcon } from '@radix-ui/react-icons';

import FetcherComboBox from '~/components/ui/FetcherComboBox';
import Button from '~/components/ui/Button';

import CreateIngredientDialog from './CreateIngredientDialog';
import type { Ingredient } from '~/types/ingredient.type';
import { Command } from 'cmdk';

interface Props {
  onSelect: (id: string, name: string) => void;
}

export default function IngredientsComboBox({ onSelect }: Props) {
  const fetcher = useFetcher<Ingredient[]>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);

  const onChange = (item: Ingredient | null) => {
    if (item) onSelect(item.id, item.name);
  };

  const onCreate = (item: Ingredient) => {
    onSelect(item.id, item.name);
    setDialogOpen(false);
    setComboOpen(false);
  };

  return (
    <>
      <FetcherComboBox
        fetcher={fetcher}
        endpoint={(search) => `/api/ingredients?search=${search}`}
        valueSelector={(item) => item.id}
        displaySelector={(item) => item.name}
        placeholder="Type to search ingredients..."
        onSelectionChange={onChange}
        open={comboOpen}
        onOpenChange={setComboOpen}
        trigger={
          <Button>
            <PlusCircledIcon /> Add ingredient
          </Button>
        }
      >
        <Command.Item
          className="
            text-sm px-1.5 py-1 mb-1 rounded cursor-pointer
            flex flex-row items-center gap-2
            aria-[selected]:bg-green-500 aria-[selected]:text-white
          "
          onSelect={() => setDialogOpen(true)}
          disabled={fetcher.state !== 'idle'}
        >
          <PlusIcon /> Add a new ingredient
        </Command.Item>
      </FetcherComboBox>

      <CreateIngredientDialog open={dialogOpen} setOpen={setDialogOpen} onCreateIngredient={onCreate} />
    </>
  );
}
