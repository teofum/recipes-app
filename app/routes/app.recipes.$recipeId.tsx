import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';

import Button from '~/components/ui/Button';

import { db } from '~/server/db.server';
import { notFound } from '~/server/request.server';
import { requireLogin } from '~/server/session.server';

export async function loader({ request, params }: LoaderArgs) {
  await requireLogin(request);

  const recipe = await db.recipe.findUnique({
    where: { id: params.recipeId },
  });
  if (!recipe) throw notFound({ error: 'Recipe not found' });

  return json({ recipe });
}

export default function RecipesIndexRoute() {
  const { recipe } = useLoaderData<typeof loader>();

  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 lg:px-8">
      <div className="my-8">
        <h2>{recipe.name}</h2>
        {JSON.stringify(recipe)}

        <Link to="new">Create new recipe</Link>
      </div>

      <Form action="/logout" method="post">
        <Button type="submit">Logout</Button>
      </Form>
    </div>
  );
}
