import { db } from './db.server';

export function deleteRecipe(recipeId: string) {
  const deleteIngredients = db.ingredientsOnRecipes.deleteMany({
    where: { recipeId: recipeId },
  });
  const deleteSteps = db.recipeStep.deleteMany({
    where: { recipeId: recipeId },
  });
  const deleteRecipe = db.recipe.delete({ where: { id: recipeId } });

  return [
    deleteIngredients,
    deleteSteps,
    deleteRecipe,
  ];
}
