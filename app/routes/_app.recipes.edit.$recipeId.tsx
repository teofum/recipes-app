import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData, useNavigation, useRouteError } from '@remix-run/react';
import { validationError } from 'remix-validated-form';

import { db } from '~/server/db.server';
import { requireLogin, requireUser } from '~/server/session.server';

import RouteError from '~/components/RouteError';
import {
  badRequest,
  forbidden,
  notFound,
  serverError,
} from '~/server/request.server';
import RecipeForm from '~/components/RecipeForm';
import RecipeView from '~/components/RecipeView';
import type { FullRecipe } from '~/types/recipe.type';
import { useEffect, useState } from 'react';
import Loading from '~/components/ui/Loading';
import { newRecipeValidator } from '~/components/RecipeForm/validators';
import buildOptimisticRecipe from '~/components/RecipeForm/buildOptimisticRecipe';
import uploadImage, { deleteImage } from '~/server/image.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Edit Recipe | CookBook' }];
};

/**
 * === Action ==================================================================
 */
export async function action({ request, params }: ActionArgs) {
  const userId = await requireLogin(request);
  const formData = await request.formData();

  const recipeId = params.recipeId;
  if (!recipeId) throw badRequest({ message: 'Recipe ID is undefined' });

  const { data, error } = await newRecipeValidator.validate(formData);
  if (error) return validationError(error, formData);

  const recipe = await db.recipe.update({
    where: { id: recipeId },
    data: {
      name: data.name,
      description: data.description,
      prepTime: data.prepTime,
      authorId: userId,
      visibility: data.visibility,

      ingredients: {
        deleteMany: {
          ingredientId: { notIn: data.ingredients.map(({ id }) => id) },
        },
        upsert: data.ingredients.map((ingredient) => ({
          where: {
            recipeId_ingredientId: {
              recipeId,
              ingredientId: ingredient.id,
            },
          },
          create: {
            ingredientId: ingredient.id,
            amount: ingredient.amount,
            unit: ingredient.unit,
          },
          update: {
            amount: ingredient.amount,
            unit: ingredient.unit,
          },
        })),
      },

      steps: {
        deleteMany: {
          id: { notIn: data.steps.map(({ id }) => id) },
        },
        upsert: data.steps.map((step, index) => ({
          where: {
            id: step.id,
          },
          create: {
            content: step.content,
            stepNumber: index + 1,
          },
          update: {
            content: step.content,
            stepNumber: index + 1,
          },
        })),
      },
    },
  });
  if (!recipe) throw serverError({ message: 'Failed to update recipe' });

  // If there's an image provided upload and update the recipe with its url
  if (data.image) {
    // If there's an existing image, delete it. We use a different image instead
    // of updating the existing one so the user doesn't get the old cached image
    if (recipe.imageUrl) await deleteImage(recipe.imageUrl);

    const filename = `${recipe.id}.${Date.now()}.webp`;
    const imageUrl = await uploadImage(data.image, 'recipe', filename);
    await db.recipe.update({ where: { id: recipe.id }, data: { imageUrl } });
  }

  return redirect(`/recipes/${recipe.id}`);
}

/**
 * === Loader ==================================================================
 */
export async function loader({ request, params }: LoaderArgs) {
  const user = await requireUser(request);

  const recipe = await db.recipe.findUnique({
    where: { id: params.recipeId },
    include: { steps: true, ingredients: { include: { ingredient: true } } },
  });
  if (!recipe) throw notFound({ message: 'Recipe not found' });

  if (user.id !== recipe.authorId)
    throw forbidden({ message: 'You are not the owner of this recipe' });

  return json({
    user,
    recipe,
    defaultValues: {
      ...recipe,
      ingredients: recipe.ingredients.map((ri) => ({
        id: ri.ingredientId,
        name: ri.ingredient.name,
        amount: ri.amount,
        unit: ri.unit,
      })),
      steps: recipe.steps.sort((a, b) => a.stepNumber - b.stepNumber),
    },
  });
}

/**
 * === Component ===============================================================
 */

export default function EditRecipeRoute() {
  const { user, defaultValues } = useLoaderData<typeof loader>();

  const { formData } = useNavigation();
  const [parsedData, setParsedData] = useState<FullRecipe | null>(null);

  useEffect(() => {
    const buildRecipe = async () => {
      if (formData) setParsedData(await buildOptimisticRecipe(formData, user));
    };

    buildRecipe();
  }, [formData, user]);

  return parsedData ? (
    <RecipeView
      recipe={parsedData}
      user={user}
      manageForm={<Loading className="text-primary-high mx-auto w-min" />}
    />
  ) : (
    <RecipeForm defaultValues={defaultValues} mode="edit" />
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
