import { PLACEHOLDER_IMAGE_URL } from '~/utils/constants';
import type { Recipe } from '~/types/recipe.type';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="relative overflow-hidden p-3 group cursor-pointer">
      <img
        src={recipe.imageUrl ?? PLACEHOLDER_IMAGE_URL}
        alt="background"
        className="
          bg-blur opacity-20 saturate-[1.25] brightness-200
          group-hover:scale-125 group-hover:opacity-25
          transition duration-300
        "
      />

      <div className="relative flex flex-row gap-3 items-center">
        <div className="flex w-16 rounded-md overflow-hidden">
          <img
            src={recipe.imageUrl ?? PLACEHOLDER_IMAGE_URL}
            alt="background"
            className="aspect-square w-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>

        <div>
          <h2 className="font-display text-2xl">{recipe.name}</h2>
          <p className="text-sm mt-1">
            {recipe.description}
          </p>
        </div>
      </div>
    </div>
  );
}
