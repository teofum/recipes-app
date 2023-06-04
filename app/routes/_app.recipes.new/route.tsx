import type { User as PrismaUser } from '@prisma/client';
import { Unit } from '@prisma/client';
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData, useNavigation, useRouteError } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import type { ValidatorData } from 'remix-validated-form';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';

import { db } from '~/server/db.server';
import { requireLogin, requireUser } from '~/server/session.server';

import {
  NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  STEP_MAX_LENGTH,
} from './constants';
import RouteError from '~/components/RouteError';
import { serverError } from '~/server/request.server';
import NewRecipeForm from './NewRecipeForm';
import RecipeView from '~/components/RecipeView';
import type { FullRecipe } from '~/types/recipe.type';
import type { User } from '~/types/user.type';
import { useEffect, useState } from 'react';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'New Recipe | CookBook' }];
};

/**
 * === Validation ==============================================================
 */
const schema = z.object({
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
});

export const newRecipeValidator = withZod(schema);

// Validator debug code
const v = newRecipeValidator.validate;
const vf = newRecipeValidator.validateField;

newRecipeValidator.validate = async (data) => {
  console.log('validating form', [...data.entries()]);
  const res = await v(data);
  console.log('validated form', res);
  return res;
};

newRecipeValidator.validateField = async (data, field) => {
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

  const { data, error } = await newRecipeValidator.validate(formData);
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
type LoaderData = Partial<ValidatorData<typeof newRecipeValidator>>;

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);

  return json<{ user: PrismaUser; defaultValues: LoaderData }>({
    user,
    defaultValues: {
      ingredients: [{ id: '', amount: 0, unit: Unit.UNITS }],
      steps: [{ content: '' }],
    },
  });
}

/**
 * === Component ===============================================================
 */
async function buildOptimisticRecipe(
  formData: FormData,
  user: User,
): Promise<FullRecipe> {
  try {
    const { data, error } = await newRecipeValidator.validate(formData);
    if (error) throw new Error('Validation failed');

    return {
      ...data,
      imageUrl: data.imageUrl ?? null,
      ingredients: data.ingredients.map((ingredient) => ({
        ingredient: {
          id: ingredient.id,
          name: 'Unavailable',
          createdAt: '',
          updatedAt: '',
        },
        ingredientId: ingredient.id,
        recipeId: '',
        amount: ingredient.amount,
        unit: ingredient.unit,
      })),
      steps: data.steps.map((step, index) => ({
        id: `temp_step_${index}`, // We need an ID here because it's used as a react key
        recipeId: '',
        stepNumber: index,
        content: step.content,
      })),
      authorId: user.id,
      author: user,
      // These are not needed to render optimistic UI
      id: '',
      createdAt: '',
      updatedAt: '',
    };
  } catch (err) {
    console.error(err);
    throw new Error('Recipe parse error');
  }
}

export default function NewRecipeRoute() {
  const { user, defaultValues } = useLoaderData<typeof loader>();

  const { formData } = useNavigation();
  const [parsedData, setParsedData] = useState<FullRecipe | null>(null);

  useEffect(() => {
    const buildRecipe = async () => {
      console.log('building recipe data', formData);
      if (formData) setParsedData(await buildOptimisticRecipe(formData, user));
    };

    buildRecipe();
  }, [formData, user]);

  return parsedData ? (
    <RecipeView recipe={parsedData} user={user} manageForm={null} />
  ) : (
    <NewRecipeForm defaultValues={defaultValues} />
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
