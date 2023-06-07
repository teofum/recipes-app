import { useFetcher } from '@remix-run/react';
import cn from 'classnames';

import FetcherComboBox, {
  useFetcherComboBox,
} from '~/components/ui/FetcherComboBox';

import CreateIngredientDialog from './CreateIngredientDialog';
import type { Ingredient } from '~/types/ingredient.type';

function CreateIngredientPrompt() {
  const { dirty } = useFetcherComboBox();

  return (
    <div
      className={cn('w-full mt-1 pt-1 border-t border-opacity-10', {
        'hidden -mt-1': !dirty,
      })}
      onKeyDown={(ev) => ev.stopPropagation()}
    >
      <div className="text-xs text-stone-600 text-center mb-0.5">
        Can't find what you need?
      </div>
      <CreateIngredientDialog />
    </div>
  );
}

interface Props {
  onSelect: (id: string, name: string) => void;
}

export default function IngredientsComboBox({ onSelect }: Props) {
  const fetcher = useFetcher<Ingredient[]>();

  const onChange = (item: Ingredient | null) => {
    if (item) onSelect(item.id, item.name);
  };

  return (
    <FetcherComboBox
      name="__ingredients_add"
      fetcher={fetcher}
      triggerProps={{ className: 'flex-1' }}
      endpoint={(search) => `/api/ingredients?search=${search}`}
      valueSelector={(item) => item.id}
      displaySelector={(item) => item.name}
      placeholder="Add an ingredient..."
      selectedItem={null}
      onChange={onChange}
    >
      <CreateIngredientPrompt />
    </FetcherComboBox>
  );
}
