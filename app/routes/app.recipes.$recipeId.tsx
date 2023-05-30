import type { Ingredient, IngredientsOnRecipes } from '@prisma/client';
import type { Unit } from '@prisma/client';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';
import Form from '~/components/ui/Form';

import { db } from '~/server/db.server';
import { forbidden, notFound } from '~/server/request.server';
import { requireLogin, requireUser } from '~/server/session.server';
import { units } from '~/types/unit.type';

const validator = withZod(
  z.object({
    recipeId: z.string(),
    authorId: z.string(),
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
      await db.ingredientsOnRecipes.deleteMany({
        where: { recipeId: data.recipeId },
      });
      await db.recipeStep.deleteMany({ where: { recipeId: data.recipeId } });
      await db.recipe.delete({ where: { id: data.recipeId } });
      return redirect('/app/recipes');
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

function formatAmount(amount: number, unit: Unit): string {
  const unitObject = units.find((u) => u.type === unit);

  return unitObject?.format(amount) ?? 'N/A';
}

function ingredientMapper(
  ingredient: IngredientsOnRecipes & { ingredient: Ingredient },
) {
  return {
    id: `${ingredient.recipeId}__${ingredient.ingredientId}`,
    name: ingredient.ingredient.name,
    displayAmount: formatAmount(ingredient.amount, ingredient.unit),
  };
}

export default function RecipesIndexRoute() {
  const { recipe, user } = useLoaderData<typeof loader>();

  const loggedUserIsOwner = user.id === recipe.authorId;

  return (
    <div className="w-full">
      <div
        className="
          relative w-full aspect-video
          bg-stone-900 overflow-hidden
          border-b border-black border-opacity-20
          max-h-64 -mb-40 p-6
        "
      >
        <img
          src="/img/curry.jpg"
          alt="background"
          className="bg-blur opacity-50 mix-blend-hard-light"
        />

        <Link to="/app/recipes" className="relative text-white">
          &lt; Back to recipes
        </Link>
      </div>

      <div
        className="
            relative w-full max-w-screen-lg mx-auto px-4 lg:px-8
            sm:grid sm:grid-cols-[1fr_auto] sm:grid-rows-[10rem_auto_auto]
            sm:items-end
            sm:gap-4
          "
      >
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
          {recipe.name}
        </h1>

        <img
          src="/img/curry.jpg"
          alt="background"
          className="
              aspect-video object-cover
              rounded-xl
              outline outline-4 outline-stone-100
              sm:w-60 sm:col-start-2 sm:row-span-2 sm:aspect-square
              md:w-80 md:rounded-3xl
            "
        />

        <aside className="sm:col-start-2">
          <div className="card">
            <h2 className="card-heading text-2xl">About this recipe</h2>
            <div>{recipe.prepTime} minutes</div>
            <div>Uploaded by {recipe.author.displayName}</div>

            {loggedUserIsOwner && (
              <div className="mt-4 pt-4 border-t border-black border-opacity-20">
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
                  <Form.SubmitButton
                    name="intent"
                    value="delete"
                    className="w-full mt-0"
                  >
                    Delete
                  </Form.SubmitButton>
                </Form.Root>
              </div>
            )}
          </div>
        </aside>

        <main
          className="
            sm:col-start-1 sm:row-start-2 sm:row-span-2 sm:min-h-full
            flex flex-col gap-4
          "
        >
          <div className="card">
            <h2 className="card-heading">Ingredients</h2>
            <ul>
              {recipe.ingredients.map(ingredientMapper).map((ingredient) => (
                <li
                  key={ingredient.id}
                  className="flex flex-row gap-2 items-baseline"
                >
                  <span>{ingredient.name}</span>
                  <span
                    className="
                      flex-1
                      border-b-2 border-dotted border-black border-opacity-40
                    "
                  />
                  <span className="font-medium">
                    {ingredient.displayAmount}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2 className="card-heading">Preparation</h2>
            <ol>
              {recipe.steps
                .sort((a, b) => a.stepNumber - b.stepNumber)
                .map((step) => (
                  <li key={step.id}>
                    {step.stepNumber} - {step.content}
                  </li>
                ))}
            </ol>
          </div>
        </main>
      </div>
    </div>
  );
}
