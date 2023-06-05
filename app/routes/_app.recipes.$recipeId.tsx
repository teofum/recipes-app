import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useRouteError } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';
import RecipeView from '~/components/RecipeView';
import RouteError from '~/components/RouteError';
import Form from '~/components/ui/Form';

import { db } from '~/server/db.server';
import { deleteRecipe } from '~/server/delete.server';
import { forbidden, notFound } from '~/server/request.server';
import { getUser } from '~/server/session.server';

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
  const user = await getUser(request);

  const formData = await request.formData();
  const { data, error } = await validator.validate(formData);
  if (error) return validationError(error);

  // Make sure the logged user is definitely authorized
  if (data.authorId !== user?.id)
    throw forbidden({
      message: 'User is not authorized to perform this action.',
    });

  switch (data.intent) {
    case 'delete': {
      await db.$transaction(deleteRecipe(data.recipeId, data.imageUrl));
      return redirect('/recipes');
    }
  }
}

export async function loader({ request, params }: LoaderArgs) {
  const start = Date.now();
  console.log('start');
  const user = await getUser(request);
  console.log('got user at', Date.now() - start, 'ms');

  const recipe = await db.recipe.findUnique({
    include: {
      ingredients: { include: { ingredient: true } },
      steps: true,
      author: true,
    },
    where: { id: params.recipeId },
  });
  if (!recipe) throw notFound({ message: 'Recipe not found' });
  console.log('got recipe at', Date.now() - start, 'ms');

  return json({ recipe, user });
}

export default function RecipeRoute() {
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

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
