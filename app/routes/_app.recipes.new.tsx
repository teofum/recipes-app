import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData, useNavigation, useRouteError } from '@remix-run/react';
import { validationError } from 'remix-validated-form';

import { db } from '~/server/db.server';
import { requireLogin, requireUser } from '~/server/session.server';

import RouteError from '~/components/RouteError';
import { serverError } from '~/server/request.server';
import RecipeForm from '~/components/RecipeForm';
import RecipeView from '~/components/RecipeView';
import type { FullRecipe } from '~/types/recipe.type';
import { useEffect, useState } from 'react';
import Loading from '~/components/ui/Loading';
import { newRecipeValidator } from '~/components/RecipeForm/validators';
import buildOptimisticRecipe from '~/components/RecipeForm/buildOptimisticRecipe';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'New Recipe | CookBook' }];
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
      visibility: data.visibility,

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
export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);

  return json({
    user,
    defaultValues: {
      steps: [{ id: 'step__default', content: '' }],
    },
  });
}

/**
 * === Component ===============================================================
 */
export default function NewRecipeRoute() {
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
      manageForm={<Loading className="text-green-700 mx-auto w-min" />}
    />
  ) : (
    <RecipeForm defaultValues={defaultValues} />
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
