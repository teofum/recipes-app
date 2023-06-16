import { PLACEHOLDER_IMAGE_URL } from '~/utils/constants';
import type { Recipe } from '~/types/recipe.type';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="card relative border border-neutral-5 overflow-hidden p-2 group cursor-pointer h-full">
      <img
        src={recipe.imageUrl ?? PLACEHOLDER_IMAGE_URL}
        alt="background"
        className="
          bg-blur opacity-20 saturate-[1.25] brightness-200
          group-hover:scale-125 group-hover:opacity-25
          transition duration-300
        "
      />

      <div className="relative">
        <div className="flex w-full rounded-md overflow-hidden">
          <img
            src={recipe.imageUrl ?? PLACEHOLDER_IMAGE_URL}
            alt="background"
            className="aspect-video w-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>

        <div className="p-2 pt-0">
          <h2 className="font-display text-4xl my-3">{recipe.name}</h2>
          <p className="border-t text-sm pt-2">
            {recipe.description}
          </p>
        </div>
      </div>
    </div>
  );
}
