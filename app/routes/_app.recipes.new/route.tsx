import { Unit } from '@prisma/client';
import type { ActionArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useFetcher, useLoaderData, useRouteError } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { useRef } from 'react';
import type {
  ValidationErrorResponseData,
  ValidatorData,
} from 'remix-validated-form';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';

import Form from '~/components/ui/Form';
import RecipeViewHeader from '~/components/RecipeView/RecipeViewHeader';
import HiddenImageForm from '~/components/forms/HiddenImageForm';
import IngredientsForm from './IngredientsForm';
import StepsForm from './StepsForm';
import NameInput from './NameInput';
import ImageUpload from './ImageUpload';

import { db } from '~/server/db.server';
import { requireLogin } from '~/server/session.server';
import type { ImageUploadAction } from '../resources.image';

import {
  NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  STEP_MAX_LENGTH,
  PLACEHOLDER_IMAGE_URL,
} from './constants';
import { TimePickerFormInput } from '~/components/ui/TimePicker';
import RouteError from '~/components/RouteError';
import { serverError } from '~/server/request.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'New Recipe | CookBook' }];
};

/**
 * === Validation ==============================================================
 */
const validator = withZod(
  z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(
        NAME_MAX_LENGTH,
        `Name must be at most ${NAME_MAX_LENGTH} characters long`,
      ),
    description: z
      .string()
      .min(1, 'A description is required')
      .max(
        DESCRIPTION_MAX_LENGTH,
        `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters long`,
      ),
    prepTime: z.coerce.number().min(0),
    imageUrl: z.string().optional(),
    ingredients: z.array(
      z.object({
        id: z.string(),
        amount: z.coerce.number().min(1, 'Cannot have zero of an ingredient'),
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

// Validator debug code
const v = validator.validate;
const vf = validator.validateField;

validator.validate = async (data) => {
  console.log('validating form', [...data.entries()]);
  const res = await v(data);
  console.log('validated form', res);
  return res;
};

validator.validateField = async (data, field) => {
  console.log(`validating ${field}`, [...data.entries()]);
  const res = await vf(data, field);
  console.log(`validated ${field}`, res);
  return res;
};

/**
 * === Action ==================================================================
 */
export async function action({ request }: ActionArgs) {
  const userId = await requireLogin(request);
  const formData = await request.formData();

  const { data, error } = await validator.validate(formData);
  if (error) return validationError(error, formData);

  const recipe = await db.recipe.create({
    data: {
      name: data.name,
      description: data.description,
      prepTime: data.prepTime,
      authorId: userId,
      imageUrl: data.imageUrl === '' ? undefined : data.imageUrl,

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
  if (!recipe) throw serverError({ message: 'Failed to create recipe' });

  return redirect(`/recipes/${recipe.id}`);
}

/**
 * === Loader ==================================================================
 */
type LoaderData = Partial<ValidatorData<typeof validator>>;

export function loader() {
  return json<LoaderData>({
    ingredients: [{ id: '', amount: 0, unit: Unit.UNITS }],
    steps: [{ content: '' }],
  });
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
  const defaultValues = useLoaderData<typeof loader>();

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
        validator={validator}
        defaultValues={defaultValues}
        method="post"
        id="new-recipe-form"
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

              <div className="flex flex-col gap-2 -mt-2">
                <Form.Field>
                  <Form.Label htmlFor="description">Description</Form.Label>
                  <Form.Textarea
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    name="description"
                    id="description"
                  />
                  <Form.Error name="description" id="descritpion" />
                </Form.Field>

                <Form.Field>
                  <Form.Label htmlFor="timeInput">Preparation time</Form.Label>
                  <TimePickerFormInput name="prepTime" id="timeInput" />
                  <Form.Error name="prepTime" id="timeInput" />
                </Form.Field>

                <Form.SubmitButton
                  className="w-full"
                  variant={{ size: 'lg', style: 'filled' }}
                >
                  Create recipe
                </Form.SubmitButton>
              </div>
            </div>
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

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
