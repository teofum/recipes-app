import { useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { PlusCircledIcon, PlusIcon } from '@radix-ui/react-icons';

import FetcherComboBox from '~/components/ui/FetcherComboBox';
import Button from '~/components/ui/Button';

import CreateIngredientDialog from './CreateIngredientDialog';
import type { Ingredient } from '~/types/ingredient.type';
import { Command } from 'cmdk';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'remix-validated-form';

interface Props {
  onSelect: (id: string, name: string) => void;
}

export default function IngredientsComboBox({ onSelect }: Props) {
  const fetcher = useFetcher<Ingredient[]>();
  const { defaultValues } = useFormContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);

  const { t } = useTranslation();

  const onChange = (item: Ingredient | null) => {
    if (item) onSelect(item.id, item.name);
  };

  const onCreate = (item: Ingredient) => {
    onSelect(item.id, item.name);
    setDialogOpen(false);
    setComboOpen(false);
  };

  const langParam = defaultValues?.language
    ? `&lang=${defaultValues?.language}`
    : '';

  return (
    <>
      <FetcherComboBox
        fetcher={fetcher}
        endpoint={(search) => `/api/ingredients?search=${search}${langParam}`}
        valueSelector={(item) => item.id}
        displaySelector={(item) => item.name}
        placeholder={
          t('recipe:form.fields.ingredients.search.placeholder') ?? undefined
        }
        onSelectionChange={onChange}
        open={comboOpen}
        onOpenChange={setComboOpen}
        trigger={
          <Button>
            <PlusCircledIcon /> {t('recipe:form.fields.ingredients.add')}
          </Button>
        }
      >
        <Command.Item
          className="
            text-sm px-1.5 py-1 mb-1 rounded cursor-pointer
            flex flex-row items-center gap-2
            aria-[selected]:bg-primary aria-[selected]:text-white
          "
          onSelect={() => setDialogOpen(true)}
          disabled={fetcher.state !== 'idle'}
        >
          <PlusIcon /> {t('recipe:form.fields.ingredients.search.add-new')}
        </Command.Item>
      </FetcherComboBox>

      <CreateIngredientDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        onCreateIngredient={onCreate}
        lang={defaultValues?.language}
      />
    </>
  );
}
