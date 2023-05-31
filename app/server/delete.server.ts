import { db } from './db.server';

export function deleteImage(imageUrl: string) {
  const fileId = imageUrl.split('/').at(-1);
  if (!fileId) throw new Error('Bad file ID');

  const deleteImage = db.image.delete({ where: { fileId } });
  const deleteFile = db.file.delete({ where: { id: fileId } });

  return [deleteImage, deleteFile];
}

export function deleteRecipe(recipeId: string, imageUrl: string) {
  const deleteIngredients = db.ingredientsOnRecipes.deleteMany({
    where: { recipeId: recipeId },
  });
  const deleteSteps = db.recipeStep.deleteMany({
    where: { recipeId: recipeId },
  });
  const deleteRecipe = db.recipe.delete({ where: { id: recipeId } });

  return [
    ...deleteImage(imageUrl),
    deleteIngredients,
    deleteSteps,
    deleteRecipe,
  ];
}
