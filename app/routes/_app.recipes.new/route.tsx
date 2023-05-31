import { Unit } from '@prisma/client';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import type { ValidationErrorResponseData } from 'remix-validated-form';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';

import Form from '~/components/ui/Form';
import RecipeViewHeader from '~/components/RecipeView/RecipeViewHeader';
import HiddenImageForm from '~/components/forms/HiddenImageForm';
import IngredientsForm from './IngredientsForm';
import StepsForm from './StepsForm';

import { db } from '~/server/db.server';
import { requireLogin } from '~/server/session.server';
import type { ImageUploadAction } from '../resources.image';

import {
  DESCRIPTION_MAX_LENGTH,
  PLACEHOLDER_IMAGE_URL,
  STEP_MAX_LENGTH,
} from './constants';
import { useRef } from 'react';
import NameInput from './NameInput';
import ImageUpload from './ImageUpload';

/**
 * === Validation ==============================================================
 */
const validator = withZod(
  z.object({
    name: z.string(),
    description: z
      .string()
      .min(1, 'A description is required')
      .max(
        DESCRIPTION_MAX_LENGTH,
        `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters long`,
      ),
    imageUrl: z.string().min(1, 'A cover image is required'),
    ingredients: z.array(
      z.object({
        id: z.string(),
        amount: z.coerce.number(),
        unit: z.enum([Unit.GRAMS, Unit.LITERS, Unit.UNITS]),
      }),
    ),
    steps: z.array(
      z.object({
        content: z
          .string()
          .min(1, 'Step content is required')
          .max(
            STEP_MAX_LENGTH,
            `Description must be at most ${STEP_MAX_LENGTH} characters long`,
          ),
      }),
    ),
  }),
);

/**
 * === Action ==================================================================
 */
export async function action({ request }: ActionArgs) {
  const userId = await requireLogin(request);
  const formData = await request.formData();

  const { data, error } = await validator.validate(formData);
  if (error) return validationError(error, formData);

  console.log(data);
  const recipe = await db.recipe.create({
    data: {
      name: data.name,
      description: data.description,
      prepTime: 15,
      authorId: userId,
      imageUrl: data.imageUrl,

      ingredients: {
        create: data.ingredients.map((ingredient) => ({
          ingredientId: ingredient.id,
          amount: ingredient.amount,
          unit: ingredient.unit,
        })),
      },

      steps: {
        create: data.steps.map((step, index) => ({
          content: step.content,
          stepNumber: index + 1,
        })),
      },
    },
  });
  if (!recipe) throw 'fuck';

  return redirect(`/recipes/${recipe.id}`);
}

/**
 * === Loader ==================================================================
 */
export async function loader({ request }: LoaderArgs) {
  await requireLogin(request);

  /**
   * Just return all ingredients and let the frontend do the filtering work
   * This is a terrible idea and won't scale well at all, check out
   * https://www.algolia.com/doc/ when time comes to implement a proper search
   */
  const allIngredients = await db.ingredient.findMany();

  return json({ allIngredients });
}

/**
 * === Component ===============================================================
 */
function isSuccessResponse(
  data: ValidationErrorResponseData | { fileId: string },
): data is { fileId: string } {
  return (data as { fileId: string }).fileId !== undefined;
}

export default function NewRecipeRoute() {
  const { allIngredients } = useLoaderData<typeof loader>();
  const imageUpload = useFetcher<ImageUploadAction>();

  const fileInput = useRef<HTMLInputElement>(null);

  let imageUrl: string | undefined = undefined;
  if (imageUpload.data && isSuccessResponse(imageUpload.data)) {
    imageUrl = `/resources/image/${imageUpload.data.fileId}`;
  }

  return (
    <div className="w-full">
      <RecipeViewHeader imageUrl={imageUrl || PLACEHOLDER_IMAGE_URL} />

      <Form.Root validator={validator} method="post" id="new-recipe-form">
        <Form.Input
          type="hidden"
          name="imageUrl"
          id="imageUrl"
          value={imageUrl || ''}
        />

        <div
          className="
            relative w-full max-w-screen-lg mx-auto px-4 lg:px-8 pb-8
            sm:grid sm:grid-cols-[1fr_15rem] sm:grid-rows-[10rem_auto_1fr]
            sm:items-end sm:gap-4
            md:grid-cols-[1fr_20rem]
          "
        >
          <NameInput />

          <ImageUpload
            imageUrl={imageUrl}
            openFile={() => fileInput.current?.click()}
          />

          <div
            className="
              sm:col-start-2 sm:row-start-3 sm:self-start
              flex flex-col gap-4
            "
          >
            <div className="card">
              <h2 className="card-heading text-2xl">About this recipe</h2>

              <Form.Field>
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Textarea
                  maxLength={DESCRIPTION_MAX_LENGTH}
                  name="description"
                  id="description"
                />
                <Form.Error name="description" id="descritpion" />
              </Form.Field>

              <Form.SubmitButton>Submit</Form.SubmitButton>
            </div>
          </div>

          <div
            className="
              sm:col-start-1 sm:row-start-2 sm:row-span-2 sm:self-start
              flex flex-col gap-4
            "
          >
            <IngredientsForm allIngredients={allIngredients} />
            <StepsForm />
          </div>
        </div>
      </Form.Root>

      <HiddenImageForm fetcher={imageUpload} ref={fileInput} />
    </div>
  );
}
