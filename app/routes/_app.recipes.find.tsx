import type { LoaderArgs } from '@remix-run/node';
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
  useSearchParams,
} from '@remix-run/react';
import type { Ingredient } from '~/types/ingredient.type';
import { LinkButton } from '~/components/ui/Button';
import { Cross1Icon, Cross2Icon } from '@radix-ui/react-icons';
import { requireLogin } from '~/server/session.server';
import { db } from '~/server/db.server';
import RecipeCard from '~/components/ui/RecipeCard';

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
          border-b border-black border-opacity-10
          pt-6 pb-6 mb-4
        "
      >
        <h1 className="font-display text-4xl">Recipe finder</h1>
        <p className="text-sm mt-2 -mb-2 text-stone-500">
          Find recipes using the ingredients you have on hand
        </p>
      </header>

      <div className="flex flex-col gap-6 pb-8">
        <div className="card">
          <h2 className="card-heading">Your ingredients</h2>

          {ingredients.length > 0 ? (
            <ul className="flex flex-row flex-wrap gap-2 mb-4">
              {ingredients.map((ingredient) => (
                <li
                  key={ingredient}
                  className="
                  flex flex-row items-center gap-1
                  text-sm leading-[26px] p-1 pl-2 rounded-md bg-green-100
                "
                >
                  {ingredient}
                  <LinkButton
                    variant={{ type: 'icon', size: 'sm', color: 'neutral' }}
                    className="bg-transparent hover:bg-green-200 focus-visible:bg-green-200"
                    to={removeIngredient(ingredient)}
                  >
                    <Cross2Icon />
                  </LinkButton>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mb-4">
              Start adding ingredients you have to see recipes using them!
            </div>
          )}

          <div className="flex flex-row items-center gap-2">
            <Form.Root validator={validator} className="flex-1">
              <FetcherComboBox
                name="ingredient"
                fetcher={fetcher}
                endpoint={(search) => `/api/ingredients?search=${search}`}
                valueSelector={(item) => item.name}
                displaySelector={(item) => item.name}
                placeholder="Find ingredients"
                onValueChange={addIngredient}
              />
            </Form.Root>

            <LinkButton to="." variant={{ color: 'danger' }}>
              <Cross1Icon />
              Clear all
            </LinkButton>
          </div>
        </div>

        {haveAll.length > 0 && (
          <div>
            <div className="text-lg">
              Found <span className="font-semibold">{haveAll.length}</span>{' '}
              {haveAll.length > 1 ? 'recipes' : 'recipe'} with your ingredients
            </div>
            <div className="text-sm text-stone-500 mb-3">
              You have everything you need to make{' '}
              {haveAll.length > 1 ? 'these recipes' : 'this recipe'}!
            </div>

            <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2">
              {haveAll.map((recipe) => (
                <li key={recipe.id}>
                  <Link to={recipe.id}>
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
              {haveAll.length > 0 ? 'Also found' : 'Found'}{' '}
              <span className="font-semibold">{haveSome.length}</span> partial{' '}
              {haveSome.length > 1 ? 'matches' : 'match'}
            </div>
            <div className="text-sm text-stone-500 mb-3">
              You may be able to make{' '}
              {haveSome.length > 1 ? 'these recipes' : 'this recipe'} with a few
              more ingredients.
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
              <div className="font-display text-4xl mt-12 mb-3">No results</div>
              <div className="text-sm [text-wrap:balance]">
                We couldn't find anything using these ingredients. Keep adding
                ingredients to find a recipe!
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
