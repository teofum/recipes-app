import { useFetcher } from '@remix-run/react';
import { useRef } from 'react';
import type { ValidationErrorResponseData } from 'remix-validated-form';

import Form from '~/components/ui/Form';
import RecipeViewHeader from '~/components/RecipeView/RecipeHeader';
import HiddenImageForm from '~/components/forms/HiddenImageForm';
import NameInput from './NameInput';
import ImageUpload from './ImageUpload';
import DetailsForm from './DetailsForm';
import IngredientsForm from './IngredientsForm';
import StepsForm from './StepsForm';

import type { ImageUploadAction } from '~/routes/resources.image';

import { PLACEHOLDER_IMAGE_URL } from '~/utils/constants';
import { newRecipeValidator } from './validators';

function isSuccessResponse(
  data: ValidationErrorResponseData | { fileId: string },
): data is { fileId: string } {
  return (data as { fileId: string }).fileId !== undefined;
}

interface NewRecipeFormProps<T> {
  defaultValues: T;
}

export default function NewRecipeForm<T extends Partial<unknown> | undefined>({
  defaultValues,
}: NewRecipeFormProps<T>) {
  const imageUpload = useFetcher<ImageUploadAction>();
  const fileInput = useRef<HTMLInputElement>(null);

  let imageUrl: string | undefined = undefined;
  if (imageUpload.data && isSuccessResponse(imageUpload.data)) {
    imageUrl = `/resources/image/${imageUpload.data.fileId}`;
  }

  return (
    <div className="w-full">
      <RecipeViewHeader imageUrl={imageUrl || PLACEHOLDER_IMAGE_URL} />

      <Form.Root
        validator={newRecipeValidator}
        defaultValues={defaultValues}
        method="post"
      >
        <div
          className="
            relative responsive pb-8
            sm:grid sm:grid-cols-[1fr_15rem] sm:grid-rows-[10rem_auto_1fr]
            sm:items-end sm:gap-4
            md:grid-cols-[1fr_20rem]
          "
        >
          <NameInput />

          <ImageUpload
            fetcher={imageUpload}
            imageUrl={imageUrl}
            openFile={() => fileInput.current?.click()}
          />

          <div
            className="
              sm:col-start-2 sm:row-start-3 sm:self-start
              flex flex-col gap-4
            "
          >
            <DetailsForm />
          </div>

          <div
            className="
              sm:col-start-1 sm:row-start-2 sm:row-span-2 sm:self-start
              flex flex-col gap-4
            "
          >
            <IngredientsForm />
            <StepsForm />
          </div>
        </div>
      </Form.Root>

      <HiddenImageForm fetcher={imageUpload} ref={fileInput} />
    </div>
  );
}
