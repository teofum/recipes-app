import type { Recipe } from '@prisma/client';
import cn from 'classnames';

/**
 * Background blur effect classnames
 */
const bgBlurEffect = `
absolute object-cover
top-[-15px] left-[-15px]
w-[calc(100%+30px)] h-[calc(100%+30px)] max-w-none
blur-[30px]
`;

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="card relative overflow-hidden p-3 group cursor-pointer">
      <img
        src="/img/curry.jpg"
        alt="background"
        className={cn(
          bgBlurEffect,
          'opacity-10 mix-blend-hard-light group-hover:scale-125 group-hover:opacity-20 transition duration-300',
        )}
      />

      <div className="relative">
        <div className="flex w-full rounded-md overflow-hidden">
          <img
            src="/img/curry.jpg"
            alt="background"
            className="aspect-video object-cover group-hover:scale-105 transition duration-300"
          />
        </div>

        <h2 className="font-display text-4xl my-3">
          {recipe.name}
        </h2>
        <p className="border-t border-black border-opacity-20 leading-6 pt-2">
          {recipe.description}
        </p>
      </div>
    </div>
  );
}
