import type { User as PrismaUser } from '@prisma/client';
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData, useNavigation, useRouteError } from '@remix-run/react';
import type { ValidatorData } from 'remix-validated-form';
import { validationError } from 'remix-validated-form';

import { db } from '~/server/db.server';
import { requireLogin, requireUser } from '~/server/session.server';

import RouteError from '~/components/RouteError';
import { serverError } from '~/server/request.server';
import RecipeForm from '~/components/RecipeForm';
import RecipeView from '~/components/RecipeView';
import type { FullRecipe } from '~/types/recipe.type';
import type { User } from '~/types/user.type';
import { useEffect, useState } from 'react';
import Loading from '~/components/ui/Loading';
import { newRecipeValidator } from '~/components/RecipeForm/validators';

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
type LoaderData = Partial<ValidatorData<typeof newRecipeValidator>>;

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);

  return json<{ user: PrismaUser; defaultValues: LoaderData }>({
    user,
    defaultValues: {
      steps: [{ content: '' }],
    },
  });
}

/**
 * === Component ===============================================================
 */
/**
 * Validates form data and creates recipe data before it's written to DB, used
 * to render optimistic UI
 * @param formData the form data that was submitted
 * @param user logged user
 * @returns recipe data
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
      imageUrl: data.imageUrl || null,
      ingredients: data.ingredients.map((ingredient) => ({
        ingredient: {
          id: ingredient.id,
          name: ingredient.name,
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
