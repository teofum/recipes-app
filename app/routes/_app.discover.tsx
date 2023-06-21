import type { Language } from '@prisma/client';
import { json, type LoaderArgs } from '@remix-run/node';
import {
  useLoaderData,
  useNavigate,
  useRouteError,
  useSearchParams,
} from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import RecipeList from '~/components/RecipeList';
import RouteError from '~/components/RouteError';
import { db } from '~/server/db.server';
import i18next from '~/server/i18n.server';

export async function loader({ request }: LoaderArgs) {
  const locale = (await i18next.getLocale(request)) as Language;

  const recipes = await db.recipe.findMany({
    where: { visibility: 'PUBLIC', language: locale },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return json({ recipes });
}

export const handle = { i18n: 'discover' };

export default function DiscoverRoute() {
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
        <h1 className="font-display text-4xl">{t('discover:title')}</h1>
      </header>

      <div className="card">
        <RecipeList
          recipes={recipes}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          title={
            <h2 className="font-display text-3xl">{t('discover:new.title')}</h2>
          }
        />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
