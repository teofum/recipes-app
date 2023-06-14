import { useFetcher } from '@remix-run/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ValidationErrorResponseData } from 'remix-validated-form';

import Dialog from '~/components/ui/Dialog';
import Form from '~/components/ui/Form';

import type { IngredientsAction } from '~/routes/api.ingredients';
import { ingredientValidator } from '~/routes/api.ingredients';
import type { Ingredient } from '~/types/ingredient.type';

function isSuccessResponse(
  data: Ingredient | ValidationErrorResponseData,
): data is Ingredient {
  return (data as ValidationErrorResponseData).fieldErrors === undefined;
}

interface CreateIngredientDialogProps {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onCreateIngredient?: (data: Ingredient) => void;
}

export default function CreateIngredientDialog({
  open,
  setOpen,
  onCreateIngredient,
}: CreateIngredientDialogProps) {
  const fetcher = useFetcher<IngredientsAction>();

  const { t } = useTranslation();

  useEffect(() => {
    if (fetcher.data && isSuccessResponse(fetcher.data)) {
      onCreateIngredient?.(fetcher.data);
    }
  }, [fetcher.data, onCreateIngredient]);

  return (
    <Dialog
      trigger={null}
      title={t('recipe:form.dialogs.new-ingredient.title')}
      description={t('recipe:form.dialogs.new-ingredient.description')}
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
          <Form.Label htmlFor="ingredientName">
            {t('recipe:form.dialogs.new-ingredient.fields.name.label')}
          </Form.Label>
          <Form.Input name="name" id="ingredientName" />
          <Form.Error name="name" id="ingredientName" />
        </Form.Field>

        <Form.SubmitButton>
          {t('recipe:form.dialogs.new-ingredient.actions.create')}
        </Form.SubmitButton>
      </Form.Root>
    </Dialog>
  );
}
