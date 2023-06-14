import { useState } from 'react';

import Button from '~/components/ui/Button';
import Dialog from '~/components/ui/Dialog';
import Form from '~/components/ui/Form';
import { HoldSubmitButton } from '~/components/ui/HoldButton';
import type { Recipe } from '~/types/recipe.type';

import { manageRecipeValidator } from '~/routes/_app.recipes.$recipeId/route';
import { useTranslation } from 'react-i18next';

interface Props {
  recipe: Recipe;
}

export default function DeleteConfirmationDialog({ recipe }: Props) {
  const [confirmation, setConfirmation] = useState('');

  const { t } = useTranslation();

  return (
    <Dialog
      trigger={
        <Button variant={{ color: 'danger' }}>
          {t('recipe:view.actions.delete')}
        </Button>
      }
      title={t('recipe:view.dialogs.delete.title')}
      description={
        <>
          {t('recipe:view.dialogs.delete.description.0')}
          <span className="font-medium text-danger">
            {t('recipe:view.dialogs.delete.description.1')}
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
            {t('recipe:view.dialogs.delete.fields.confirmation.label.0')}
            <span className="font-medium">{recipe.name}</span>
            {t('recipe:view.dialogs.delete.fields.confirmation.label.1')}
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
          {t('recipe:view.dialogs.delete.actions.delete')}
        </HoldSubmitButton>
      </Form.Root>
    </Dialog>
  );
}
