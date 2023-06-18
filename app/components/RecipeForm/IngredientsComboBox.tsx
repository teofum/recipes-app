import { useCallback, useState } from 'react';
import { PlusCircledIcon, PlusIcon } from '@radix-ui/react-icons';

import Button from '~/components/ui/Button';

import CreateIngredientDialog from './CreateIngredientDialog';
import type { Ingredient } from '~/types/ingredient.type';
import { Command } from 'cmdk';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'remix-validated-form';
import AlgoliaSearch from '../ui/AlgoliaSearch';

interface Props {
  onSelect: (id: string, name: string) => void;
}

export default function IngredientsComboBox({ onSelect }: Props) {
  const { defaultValues } = useFormContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);

  const { t } = useTranslation();

  const select = (id: string, name: string) => {
    onSelect(id, name);
    setComboOpen(false);
  };

  const onCreate = useCallback((item: Ingredient) => {
    onSelect(item.id, item.name);
    setDialogOpen(false);
    setComboOpen(false);
  }, [onSelect]);

  return (
    <>
      <AlgoliaSearch.Root
        indexName="ingredients_dev"
        trigger={
          <Button>
            <PlusCircledIcon /> {t('recipe:form.fields.ingredients.add')}
          </Button>
        }
        open={comboOpen}
        onOpenChange={setComboOpen}
      >
        <AlgoliaSearch.SearchBox />
        <AlgoliaSearch.Hits
          displayValue={(hit) => hit.name as string}
          onSelect={(hit) => select(hit.objectID as string, hit.name as string)}
        />
        <Command.Item
          className="
            text-sm px-1.5 py-1 mb-1 rounded cursor-pointer
            flex flex-row items-center gap-2
            aria-[selected]:bg-primary aria-[selected]:text-white
          "
          onSelect={() => setDialogOpen(true)}
        >
          <PlusIcon /> {t('recipe:form.fields.ingredients.search.add-new')}
        </Command.Item>
      </AlgoliaSearch.Root>

      <CreateIngredientDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        onCreateIngredient={onCreate}
        lang={defaultValues?.language}
      />
    </>
  );
}
