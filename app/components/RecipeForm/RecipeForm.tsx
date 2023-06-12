import Form from '~/components/ui/Form';
import RecipeHeader from '~/components/RecipeView/RecipeHeader';
import NameInput from './NameInput';
import ImageUpload from './ImageUpload';
import DetailsForm from './DetailsForm';
import IngredientsForm from './IngredientsForm';
import StepsForm from './StepsForm';

import { PLACEHOLDER_IMAGE_URL } from '~/utils/constants';
import { newRecipeValidator } from './validators';
import { useState } from 'react';

interface NewRecipeFormProps<T> {
  defaultValues: T;
  mode?: 'create' | 'edit';
}

export default function NewRecipeForm<T extends Partial<unknown> | undefined>({
  defaultValues,
  mode = 'create',
}: NewRecipeFormProps<T>) {
  let defaultImageUrl =
    (defaultValues as { imageUrl: string | null } | undefined)?.imageUrl ??
    null;

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <div className="w-full">
      <RecipeHeader
        imageUrl={imageUrl ?? defaultImageUrl ?? PLACEHOLDER_IMAGE_URL}
        hideBackButton={mode === 'edit'}
      />

      <Form.Root
        validator={newRecipeValidator}
        defaultValues={defaultValues}
        method="post"
        encType="multipart/form-data"
      >
        <div
          className="
            relative responsive pb-8
            flex flex-col gap-4
            sm:grid sm:grid-cols-[1fr_15rem] sm:grid-rows-[10rem_1fr] sm:items-start
            md:grid-cols-[1fr_20rem]
          "
        >
          <NameInput />

          <div
            className="
              card flex flex-col gap-4
              sm:w-full sm:col-start-2 sm:row-span-2
            "
          >
            <ImageUpload
              imageUrl={imageUrl}
              defaultImageUrl={defaultImageUrl}
              setImageUrl={setImageUrl}
            />

            <DetailsForm mode={mode} />
          </div>

          <div className="flex flex-col gap-4 sm:col-start-1 sm:row-start-2">
            <IngredientsForm />
            <StepsForm />
          </div>
        </div>
      </Form.Root>
    </div>
  );
}
