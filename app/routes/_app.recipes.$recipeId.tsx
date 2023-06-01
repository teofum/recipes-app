import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';
import RecipeView from '~/components/RecipeView/RecipeView';
import Form from '~/components/ui/Form';

import { db } from '~/server/db.server';
import { deleteRecipe } from '~/server/delete.server';
import { forbidden, notFound } from '~/server/request.server';
import { requireLogin, requireUser } from '~/server/session.server';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.recipe.name ?? 'Recipe'} | CookBook` }];
};

const validator = withZod(
  z.object({
    recipeId: z.string(),
    authorId: z.string(),
    imageUrl: z.string().optional(),
    intent: z.enum(['delete']),
  }),
);

export async function action({ request }: ActionArgs) {
  const userId = await requireLogin(request);

  const formData = await request.formData();
  const { data, error } = await validator.validate(formData);
  if (error) return validationError(error);

  // Make sure the logged user is definitely authorized
  if (data.authorId !== userId)
    throw forbidden({
      error: 'User is not authorized to perform this action.',
    });

  switch (data.intent) {
    case 'delete': {
      await db.$transaction(deleteRecipe(data.recipeId, data.imageUrl));
      return redirect('/recipes');
    }
  }
}

export async function loader({ request, params }: LoaderArgs) {
  const user = await requireUser(request);

  const recipe = await db.recipe.findUnique({
    include: {
      ingredients: { include: { ingredient: true } },
      steps: true,
      author: true,
    },
    where: { id: params.recipeId },
  });
  if (!recipe) throw notFound({ error: 'Recipe not found' });

  return json({ recipe, user });
}

export default function RecipesIndexRoute() {
  const { recipe, user } = useLoaderData<typeof loader>();

  const manageForm = (
    <Form.Root validator={validator} method="post">
      <Form.Input
        type="hidden"
        name="recipeId"
        id="recipeId"
        value={recipe.id}
      />
      <Form.Input
        type="hidden"
        name="authorId"
        id="authorId"
        value={recipe.authorId}
      />
      <Form.Input
        type="hidden"
        name="imageUrl"
        id="imageUrl"
        value={recipe.imageUrl ?? undefined}
      />

      <Form.SubmitButton
        name="intent"
        value="delete"
        variant={{ color: 'danger' }}
      >
        Delete
      </Form.SubmitButton>
    </Form.Root>
  );

  return <RecipeView recipe={recipe} user={user} manageForm={manageForm} />;
}
