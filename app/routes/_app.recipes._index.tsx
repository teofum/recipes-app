import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { LinkButton } from '~/components/ui/Button';
import RecipeCard from '~/components/ui/RecipeCard';

import { db } from '~/server/db.server';
import { notFound } from '~/server/request.server';
import { requireLogin } from '~/server/session.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'My Recipes | CookBook' }];
};

export async function loader({ request }: LoaderArgs) {
  const userId = await requireLogin(request);

  const user = await db.user.findUnique({
    include: { recipes: true },
    where: { id: userId },
  });
  if (!user) throw notFound({ error: 'User data not found' });

  return json({ user });
}

export default function RecipesIndexRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 lg:px-8">
      <header
        className="
          flex flex-row items-center justify-between
          border-b border-black border-opacity-10
          py-6 mb-4
        "
      >
        <h1 className="font-display text-4xl">My recipes</h1>
        <LinkButton variant="filled" to="new">
          Create new recipe
        </LinkButton>
      </header>

      {user.recipes.length > 0 ? (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2">
          {user.recipes.map((recipe) => (
            <li key={recipe.id}>
              <Link to={recipe.id}>
                <RecipeCard recipe={recipe} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>You don't have any recipes</p>
      )}
    </div>
  );
}
