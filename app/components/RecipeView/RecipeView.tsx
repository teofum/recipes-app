import type { Unit } from '@prisma/client';
import { TimerIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import type { FullRecipe, RecipeIngredient } from '~/types/recipe.type';
import { units } from '~/types/unit.type';
import type { User } from '~/types/user.type';
import RecipeHeader from './RecipeHeader';
import { PLACEHOLDER_IMAGE_URL } from '~/utils/constants';

function formatTime(totalMinutes: number, t: TFunction): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  return `${hours > 0 ? t('format.hours', { count: hours }) : ''} ${t(
    'format.minutes',
    { count: minutes },
  )}`;
}

function formatTimeShort(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  return (hours > 0 ? `${hours} h, ` : '') + `${minutes} min`;
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
  const { t } = useTranslation();

  const loggedUserIsOwner = user?.id === recipe.authorId;

  return (
    <div className="w-full">
      <RecipeHeader imageUrl={recipe.imageUrl ?? PLACEHOLDER_IMAGE_URL} />

      <div
        className="
            relative responsive pb-8
            flex flex-col gap-4
            sm:grid sm:grid-cols-[1fr_15rem] sm:grid-rows-[10rem_1fr] sm:items-start
            md:grid-cols-[1fr_20rem]
          "
      >
        <h1 className="font-display text-5xl lg:text-6xl mb-4 sm:self-end">
          {recipe.name}
        </h1>

        <aside className="card flex flex-col gap-4 p-2 sm:w-full sm:col-start-2 sm:row-span-2">
          <img
            src={recipe.imageUrl ?? PLACEHOLDER_IMAGE_URL}
            alt="background"
            className="aspect-video object-cover w-full rounded-lg sm:aspect-square"
          />

          <div className="flex flex-col gap-2 p-4">
            <p className="text-sm">{recipe.description}</p>

            <div className="text-sm text-light">
              {t('recipe:view.uploaded-by')}
              {recipe.author.displayName}
            </div>

            {loggedUserIsOwner && (
              <div className="mt-2 pt-4 border-t">{manageForm}</div>
            )}
          </div>
        </aside>

        <main
          className="
            sm:col-start-1 sm:row-start-2 sm:min-h-full
            flex flex-col gap-4
          "
        >
          <div className="card">
            <div className="card-heading">
              <h2>{t('recipe:view.ingredients')}</h2>
            </div>

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
            <div className="card-heading">
              <h2>{t('recipe:view.preparation')}</h2>
              <div
                className="
                  flex flex-row items-center gap-2 py-1 px-2
                  border rounded-full
                "
              >
                <TimerIcon className="text-primary" />
                <span className="text-sm hidden sm:inline">
                  {formatTime(recipe.prepTime, t)}
                </span>
                <span className="text-sm sm:hidden">
                  {formatTimeShort(recipe.prepTime)}
                </span>
              </div>
            </div>

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
                          bg-primary-5 text-primary border border-primary
                          flex items-center justify-center
                        "
                      >
                        {step.stepNumber}
                      </div>
                      <div className="w-px flex-1 bg-primary group-last:bg-transparent" />
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
