import type { Unit } from '@prisma/client';
import { Link } from '@remix-run/react';
import type { FullRecipe, RecipeIngredient } from '~/types/recipe.type';
import { units } from '~/types/unit.type';
import type { User } from '~/types/user.type';

function formatAmount(amount: number, unit: Unit): string {
  const unitObject = units.find((u) => u.type === unit);

  return unitObject?.format(amount) ?? 'N/A';
}

function ingredientMapper(ingredient: RecipeIngredient) {
  return {
    id: `${ingredient.recipeId}__${ingredient.ingredientId}`,
    name: ingredient.ingredient.name,
    displayAmount: formatAmount(ingredient.amount, ingredient.unit),
  };
}

interface RecipeViewProps {
  recipe: FullRecipe;
  user: User;
  manageForm?: React.ReactNode;
}

export default function RecipeView({
  recipe,
  user,
  manageForm,
}: RecipeViewProps) {
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
                {manageForm}
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
