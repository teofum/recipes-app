import { PlusCircledIcon } from '@radix-ui/react-icons';
import { useFetcher } from '@remix-run/react';

import Dialog from '~/components/ui/Dialog';
import Form from '~/components/ui/Form';

import type { IngredientsAction } from '../api.ingredients';
import { ingredientValidator } from '../api.ingredients';
import { useEffect, useState } from 'react';
import Button from '~/components/ui/Button';
import { useFetcherComboBox } from '~/components/ui/FetcherComboBox';

export default function CreateIngredientDialog() {
  const { close, state } = useFetcherComboBox();
  const fetcher = useFetcher<IngredientsAction>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (fetcher.data) {
      close();
      setOpen(false);
    }
  }, [fetcher.data, close]);

  return (
    <Dialog
      trigger={
        <Button className="w-full" disabled={state !== 'idle'}>
          <PlusCircledIcon />
          Add new ingredient
        </Button>
      }
      title="New ingredient"
      description="Can't find the right ingredient? Add it yourself. This ingredient will be available for all recipes going forward."
      open={open}
      onOpenChange={setOpen}
    >
      <Form.Root
        method="post"
        action="/api/ingredients"
        fetcher={fetcher}
        validator={ingredientValidator}
      >
        <Form.Field>
          <Form.Label htmlFor="ingredientName">Name</Form.Label>
          <Form.Input name="name" id="ingredientName" />
          <Form.Error name="name" id="ingredientName" />
        </Form.Field>

        <Form.SubmitButton>Create</Form.SubmitButton>
      </Form.Root>
    </Dialog>
  );
}
