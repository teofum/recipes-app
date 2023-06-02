import type { Unit } from '@prisma/client';
import type { FullRecipe, RecipeIngredient } from '~/types/recipe.type';
import { units } from '~/types/unit.type';
import type { User } from '~/types/user.type';
import RecipeViewHeader from './RecipeViewHeader';
import { PLACEHOLDER_IMAGE_URL } from '~/routes/_app.recipes.new/constants';
import { TimerIcon } from '@radix-ui/react-icons';

function formatTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  return (hours > 0 ? `${hours}'` : '') + `${minutes}"`;
}

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
  user?: User | null;
  manageForm?: React.ReactNode;
}

export default function RecipeView({
  recipe,
  user,
  manageForm,
}: RecipeViewProps) {
  const loggedUserIsOwner = user?.id === recipe.authorId;

  return (
    <div className="w-full">
      <RecipeViewHeader imageUrl={recipe.imageUrl ?? PLACEHOLDER_IMAGE_URL} />

      <div
        className="
            relative responsive pb-8
            sm:grid sm:grid-cols-[1fr_15rem] sm:grid-rows-[10rem_auto_1fr]
            sm:items-end sm:gap-4
            md:grid-cols-[1fr_20rem]
          "
      >
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
          {recipe.name}
        </h1>

        <div className="card flex p-2 sm:w-full sm:col-start-2 sm:row-span-2">
          <img
            src={recipe.imageUrl ?? PLACEHOLDER_IMAGE_URL}
            alt="background"
            className=" aspect-video object-cover w-full rounded-lg sm:aspect-square"
          />
        </div>

        <aside className="sm:col-start-2 sm:self-start">
          <div className="card">
            <h2 className="card-heading text-2xl">About this recipe</h2>
            <div className="flex flex-col gap-2 -mt-2">
              <p className="text-sm">{recipe.description}</p>

              <div className="flex flex-row items-center gap-1">
                <TimerIcon className="text-green-500" />
                {formatTime(recipe.prepTime)}
              </div>

              <div className="text-sm text-stone-500">
                Uploaded by {recipe.author.displayName}
              </div>
            </div>

            {loggedUserIsOwner && (
              <div className="mt-4 pt-4 border-t border-black border-opacity-10">
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
                  className="flex flex-row gap-2 items-baseline leading-relaxed"
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
                  <li
                    key={step.id}
                    className="flex flex-row gap-3 items-start group"
                  >
                    <div className="self-stretch flex-shrink-0 flex flex-col items-center">
                      <div
                        className="
                          w-6 h-6 rounded-full text-sm font-medium
                          bg-green-50 text-green-500 border border-green-500
                          flex items-center justify-center
                        "
                      >
                        {step.stepNumber}
                      </div>
                      <div className="w-px flex-1 bg-green-500 group-last:bg-transparent" />
                    </div>

                    <p className="mb-4">{step.content}</p>
                  </li>
                ))}
            </ol>
          </div>
        </main>
      </div>
    </div>
  );
}
