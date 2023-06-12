import type { FullRecipe } from '~/types/recipe.type';
import type { User } from '~/types/user.type';
import { newRecipeValidator } from './validators';

/**
 * Validates form data and creates recipe data before it's written to DB, used
 * to render optimistic UI
 * @param formData the form data that was submitted
 * @param user logged user
 * @returns recipe data
 */
export default async function buildOptimisticRecipe(
  formData: FormData,
  user: User,
): Promise<FullRecipe> {
  try {
    const { data, error } = await newRecipeValidator.validate(formData);
    if (error) throw new Error('Validation failed');

    return {
      ...data,
      imageUrl: data.image ? URL.createObjectURL(data.image) : null,
      ingredients: data.ingredients.map((ingredient) => ({
        ingredient: {
          id: ingredient.id,
          name: ingredient.name,
          createdAt: '',
          updatedAt: '',
        },
        ingredientId: ingredient.id,
        recipeId: '',
        amount: ingredient.amount,
        unit: ingredient.unit,
      })),
      steps: data.steps.map((step, index) => ({
        id: `temp_step_${index}`, // We need an ID here because it's used as a react key
        recipeId: '',
        stepNumber: index + 1,
        content: step.content,
      })),
      authorId: user.id,
      author: user,
      // These are not needed to render optimistic UI
      id: '',
      createdAt: '',
      updatedAt: '',
    };
  } catch (err) {
    console.error(err);
    throw new Error('Recipe parse error');
  }
}
