import type { Language } from '@prisma/client';
import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  useLoaderData,
  useNavigate,
  useRouteError,
  useSearchParams,
} from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import RecipeList from '~/components/RecipeList';
import RouteError from '~/components/RouteError';
import { LinkButton } from '~/components/ui/Button';

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

  const [params] = useSearchParams();
  const navigate = useNavigate();

  const viewMode = params.get('v') === 'list' ? 'list' : 'grid';
  const setViewMode = (mode: string) => {
    params.set('v', mode);
    navigate(`?${params.toString()}`);
  };

  return (
    <div className="responsive pb-8">
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

      <RecipeList
        recipes={recipes}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
