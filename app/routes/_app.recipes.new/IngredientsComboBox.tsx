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
      <div className="text-xs text-stone-500 text-center mb-0.5">
        Can't find what you need?
      </div>
      <CreateIngredientDialog />
    </div>
  );
}

interface Props {
  name: string;
}

export default function IngredientsComboBox({ name }: Props) {
  const fetcher = useFetcher<Ingredient[]>();

  return (
    <FetcherComboBox
      name={name}
      fetcher={fetcher}
      triggerProps={{ className: 'flex-1' }}
      endpoint={(search) => `/api/ingredients?search=${search}`}
      valueSelector={(item) => item.id}
      displaySelector={(item) => item.name}
      placeholder="Select an ingredient"
    >
      <CreateIngredientPrompt />
    </FetcherComboBox>
  );
}
