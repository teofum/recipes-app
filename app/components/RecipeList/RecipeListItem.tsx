import { PLACEHOLDER_IMAGE_URL } from '~/utils/constants';
import type { Recipe } from '~/types/recipe.type';
import TimeBadge from '../ui/TimeBadge';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="relative overflow-hidden p-3 group cursor-pointer flex flex-col gap-2">
      <img
        src={recipe.imageUrl ?? PLACEHOLDER_IMAGE_URL}
        alt="background"
        className="
          bg-blur opacity-0 saturate-[1.25] brightness-200
          group-hover:scale-125 group-hover:opacity-20
          transition duration-300
        "
      />

      <div className="relative flex flex-row gap-3 items-center">
        <div className="flex w-16 flex-shrink-0 rounded-md overflow-hidden">
          <img
            src={recipe.imageUrl ?? PLACEHOLDER_IMAGE_URL}
            alt="background"
            className="aspect-square w-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>

        <div className="flex-1 flex-shrink">
          <h2 className="font-display text-xl sm:text-2xl line-clamp-1">
            {recipe.name}
          </h2>
          <p className="text-xs sm:text-sm mt-1 line-clamp-2">
            {recipe.description}
          </p>
        </div>

        <div className="hidden sm:block surface-thick rounded-full">
          <TimeBadge minutes={recipe.prepTime} format="short" />
        </div>
      </div>

      <div className="sm:hidden self-start surface-thick rounded-full">
        <TimeBadge minutes={recipe.prepTime} format="short" />
      </div>
    </div>
  );
}
