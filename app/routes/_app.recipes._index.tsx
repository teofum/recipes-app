import type { Language } from '@prisma/client';
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData, useRouteError } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import RouteError from '~/components/RouteError';
import { LinkButton } from '~/components/ui/Button';
import RecipeCard from '~/components/ui/RecipeCard';

import { db } from '~/server/db.server';
import i18next from '~/server/i18n.server';
import { requireLogin } from '~/server/session.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'My Recipes | CookBook' }];
};

export async function loader({ request }: LoaderArgs) {
  const userId = await requireLogin(request);
  const locale = (await i18next.getLocale(request)) as Language;

  const recipes = await db.recipe.findMany({
    where: { authorId: userId, language: locale },
  });

  return json({ recipes });
}

export const handle = { i18n: 'recipe' };

export default function RecipesIndexRoute() {
  const { recipes } = useLoaderData<typeof loader>();

  const { t } = useTranslation();

  return (
    <div className="responsive">
      <header
        className="
          flex flex-row items-center justify-between
          border-b
          py-6 mb-4
        "
      >
        <h1 className="font-display text-4xl">{t('recipe:list.title')}</h1>
        <LinkButton variant="filled" to="new">
          {t('recipe:list.cta-create')}
        </LinkButton>
      </header>

      {recipes.length > 0 ? (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <Link to={recipe.id}>
                <RecipeCard recipe={recipe} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>{t('recipe:list.empty')}</p>
      )}
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
