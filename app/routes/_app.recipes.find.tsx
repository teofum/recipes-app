import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import Form from '~/components/ui/Form';
import FetcherComboBox from '~/components/ui/FetcherComboBox';
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigate,
  useRouteError,
  useSearchParams,
} from '@remix-run/react';
import type { Ingredient } from '~/types/ingredient.type';
import Button, { LinkButton } from '~/components/ui/Button';
import { Cross1Icon, Cross2Icon } from '@radix-ui/react-icons';
import { requireLogin } from '~/server/session.server';
import { db } from '~/server/db.server';
import RecipeCard from '~/components/ui/RecipeCard';
import RouteError from '~/components/RouteError';
import { useTranslation } from 'react-i18next';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Recipe Finder | CookBook' }];
};

const validator = withZod(z.unknown());

export async function loader({ request }: LoaderArgs) {
  const userId = await requireLogin(request);

  const url = new URL(request.url);
  const ingredientNames = url.searchParams.get('ingredients')?.split(',');

  if (!ingredientNames) return json({ haveSome: [], haveAll: [] });

  const haveSome = await db.recipe.findMany({
    where: {
      authorId: userId,
      ingredients: {
        some: { ingredient: { name: { in: ingredientNames } } },
      },
      NOT: {
        ingredients: {
          every: { ingredient: { name: { in: ingredientNames } } },
        },
      },
    },
  });

  const haveAll = await db.recipe.findMany({
    where: {
      authorId: userId,
      ingredients: {
        every: { ingredient: { name: { in: ingredientNames } } },
      },
    },
  });

  return json({ haveSome, haveAll });
}

export default function FindRecipeRoute() {
  const { haveSome, haveAll } = useLoaderData<typeof loader>();

  const [params] = useSearchParams();
  const fetcher = useFetcher<Ingredient[]>();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const ingredients = params.get('ingredients')?.split(',') ?? [];

  const addIngredient = (ingredient: string) => {
    const newIngredients = [...ingredients];
    if (!newIngredients.includes(ingredient)) newIngredients.push(ingredient);

    const newParam = `${newIngredients.join(',')}`;
    navigate(`?ingredients=${newParam}`);
  };

  const removeIngredient = (ingredient: string) => {
    const newParam = ingredients.filter((i) => i !== ingredient).join(',');
    return `?ingredients=${newParam}`;
  };

  return (
    <div className="responsive">
      <header
        className="
          border-b
          pt-6 pb-6 mb-4
        "
      >
        <h1 className="font-display text-4xl">{t('recipe:find.title')}</h1>
        <p className="text-sm mt-2 -mb-2 text-light">
          {t('recipe:find.description')}
        </p>
      </header>

      <div className="flex flex-col gap-6 pb-8">
        <div className="card">
          <div className="card-heading">
            <h2>{t('recipe:find.search.title')}</h2>
          </div>

          {ingredients.length > 0 ? (
            <ul className="flex flex-row flex-wrap gap-2 mb-4">
              {ingredients.map((ingredient) => (
                <li
                  key={ingredient}
                  className="
                  flex flex-row items-center gap-1
                  text-sm leading-[26px] p-1 pl-2 rounded-md bg-primary-4
                "
                >
                  {ingredient}
                  <LinkButton
                    variant={{ type: 'icon', size: 'sm', color: 'neutral' }}
                    className="bg-transparent hover:bg-primary-3 focus-visible:bg-primary-3"
                    to={removeIngredient(ingredient)}
                  >
                    <Cross2Icon />
                  </LinkButton>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mb-4 text-sm">
              {t('recipe:find.search.placeholder')}
            </div>
          )}

          <div className="flex flex-row items-center gap-2">
            <Form.Root validator={validator} className="flex-1">
              <FetcherComboBox
                fetcher={fetcher}
                endpoint={(search) => `/api/ingredients?search=${search}`}
                valueSelector={(item) => item.name}
                displaySelector={(item) => item.name}
                placeholder={
                  t('recipe:find.search.find.placeholder') ?? undefined
                }
                onSelectionChange={(item) => {
                  if (item) addIngredient(item.name);
                }}
                trigger={
                  <Button>{t('recipe:find.search.actions.find')}</Button>
                }
              />
            </Form.Root>

            <LinkButton to="." variant={{ color: 'danger' }}>
              <Cross1Icon />
              {t('recipe:find.search.actions.clear')}
            </LinkButton>
          </div>
        </div>

        {haveAll.length > 0 && (
          <div>
            <div className="text-lg">
              {t('recipe:find.results.full.title.0')}
              <span className="font-semibold">{haveAll.length}</span>
              {t('recipe:find.results.full.title.1', { count: haveAll.length })}
            </div>
            <div className="text-sm text-light mb-3">
              {t('recipe:find.results.full.description', {
                count: haveAll.length,
              })}
            </div>

            <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2">
              {haveAll.map((recipe) => (
                <li key={recipe.id}>
                  <Link to={`/recipes/${recipe.id}`}>
                    <RecipeCard recipe={recipe} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {haveSome.length > 0 && (
          <div>
            <div className="text-lg">
              {t('recipe:find.results.partial.title.0', {
                count: haveAll.length,
              })}
              <span className="font-semibold">{haveSome.length}</span>
              {t('recipe:find.results.partial.title.1', {
                count: haveSome.length,
              })}
            </div>
            <div className="text-sm text-light mb-3">
              {t('recipe:find.results.partial.description', {
                count: haveSome.length,
              })}
            </div>

            <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2">
              {haveSome.map((recipe) => (
                <li key={recipe.id}>
                  <Link to={recipe.id}>
                    <RecipeCard recipe={recipe} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {ingredients.length > 0 &&
          haveAll.length === 0 &&
          haveSome.length === 0 && (
            <div className="text-center max-w-sm mx-auto">
              <div className="font-display text-4xl mt-12 mb-3">
                {t('recipe:find.results.none.title')}
              </div>
              <div className="text-sm [text-wrap:balance]">
                {t('recipe:find.results.none.description')}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
