import { Visibility } from '@prisma/client';
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useRouteError } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';

import RecipeView from '~/components/RecipeView';
import RouteError from '~/components/RouteError';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ShareDialog from './ShareDialog';

import { db } from '~/server/db.server';
import { deleteRecipe } from '~/server/delete.server';
import { forbidden, notFound } from '~/server/request.server';
import { getUser } from '~/server/session.server';

import type { Recipe } from '~/types/recipe.type';
import { LinkButton } from '~/components/ui/Button';
import { deleteImage } from '~/server/image.server';
import { useTranslation } from 'react-i18next';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.recipe.name ?? 'Recipe'} | CookBook` }];
};

export const manageRecipeValidator = withZod(
  z.union([
    z.object({
      recipeId: z.string(),
      authorId: z.string(),
      imageUrl: z.string().optional(),
      intent: z.literal('delete'),
    }),
    z.object({
      recipeId: z.string(),
      authorId: z.string(),
      visibility: z.enum([
        Visibility.PUBLIC,
        Visibility.UNLISTED,
        Visibility.PRIVATE,
      ]),
      intent: z.literal('setVisibility'),
    }),
  ]),
);

export async function action({ request }: ActionArgs) {
  const user = await getUser(request);

  const formData = await request.formData();
  const { data, error } = await manageRecipeValidator.validate(formData);
  if (error) return validationError(error);

  // Make sure the logged user is definitely authorized
  if (data.authorId !== user?.id)
    throw forbidden({
      message: 'User is not authorized to perform this action.',
    });

  switch (data.intent) {
    case 'delete': {
      await db.$transaction(deleteRecipe(data.recipeId));
      if (data.imageUrl) await deleteImage(data.imageUrl);
      return redirect('/recipes');
    }
    case 'setVisibility': {
      const updated = await db.recipe.update({
        where: { id: data.recipeId },
        data: { visibility: data.visibility },
      });
      return json({ recipe: updated });
    }
  }
}

export async function loader({ request, params }: LoaderArgs) {
  const user = await getUser(request);

  const recipe = await db.recipe.findUnique({
    include: {
      ingredients: { include: { ingredient: true } },
      steps: true,
      author: true,
    },
    where: { id: params.recipeId },
  });
  if (!recipe) throw notFound({ message: 'Recipe not found' });

  // Check the user is authorized to see the recipe, private recipes are only
  // visible to their creator
  if (recipe.visibility === Visibility.PRIVATE && user?.id !== recipe.authorId)
    throw notFound({ message: 'Recipe not found' });

  return json({ recipe, user });
}

export const handle = { i18n: 'recipe' };

function ManageForm({ recipe }: { recipe: Recipe }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <ShareDialog recipe={recipe} />
      <LinkButton to={`/recipes/edit/${recipe.id}`}>
        {t('recipe:view.actions.edit')}
      </LinkButton>
      <DeleteConfirmationDialog recipe={recipe} />
    </div>
  );
}

export default function RecipeRoute() {
  const { recipe, user } = useLoaderData<typeof loader>();

  return (
    <RecipeView
      recipe={recipe}
      user={user}
      manageForm={<ManageForm recipe={recipe} />}
    />
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
