import { useState } from 'react';

import Button from '~/components/ui/Button';
import Dialog from '~/components/ui/Dialog';
import Form from '~/components/ui/Form';
import { HoldSubmitButton } from '~/components/ui/HoldButton';
import type { Recipe } from '~/types/recipe.type';

import { manageRecipeValidator } from '~/routes/_app.recipes.$recipeId/route';

interface Props {
  recipe: Recipe;
}

export default function DeleteConfirmationDialog({ recipe }: Props) {
  const [confirmation, setConfirmation] = useState('');

  return (
    <Dialog
      trigger={
        <Button variant={{ color: 'danger' }}>
          Delete
        </Button>
      }
      title="Delete recipe"
      description={
        <>
          Please confirm you want to delete this recipe.{' '}
          <span className="font-medium text-red-600">
            This action is permanent and cannot be undone.
          </span>
        </>
      }
    >
      <Form.Root
        validator={manageRecipeValidator}
        method="post"
        className="mt-2"
      >
        <Form.Input
          type="hidden"
          name="recipeId"
          id="recipeId"
          value={recipe.id}
        />
        <Form.Input
          type="hidden"
          name="authorId"
          id="authorId"
          value={recipe.authorId}
        />
        <Form.Input
          type="hidden"
          name="imageUrl"
          id="imageUrl"
          value={recipe.imageUrl ?? undefined}
        />
        <Form.Input
          type="hidden"
          name="intent"
          id="intentDelete"
          value="delete"
        />

        <Form.Field>
          <Form.Label htmlFor="confirmation">
            Type <span className="font-medium">{recipe.name}</span> to confirm
          </Form.Label>
          <Form.Input
            name="confirmation"
            id="confirmation"
            onChange={(ev) => setConfirmation(ev.target.value)}
          />
        </Form.Field>

        <HoldSubmitButton
          variant={{ color: 'danger', style: 'filled' }}
          disabled={confirmation !== recipe.name}
        >
          Hold to delete
        </HoldSubmitButton>
      </Form.Root>
    </Dialog>
  );
}
