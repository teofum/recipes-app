import type {
  Ingredient,
  IngredientsOnRecipes,
  Recipe as PrismaRecipe,
  RecipeStep,
  User,
} from '@prisma/client';
import type { Serialize } from '~/utils/Serialize.type';

export type Recipe = Serialize<PrismaRecipe>;

export type RecipeAuthor = Serialize<{ author: User }>;
export type RecipeIngredient = Serialize<
  IngredientsOnRecipes & { ingredient: Ingredient }
>;
export type RecipeIngredients = Serialize<{
  ingredients: RecipeIngredient[];
}>;
export type RecipeSteps = Serialize<{ steps: RecipeStep[] }>;

export type FullRecipe = Recipe &
  RecipeAuthor &
  RecipeIngredients &
  RecipeSteps;
