import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';
import { db } from '~/server/db.server';

export const ingredientValidator = withZod(
  z.object({
    name: z
      .string()
      .min(1, 'recipe:form.dialogs.new-ingredient.validation.name.required')
      .max(40, 'recipe:form.dialogs.new-ingredient.validation.name.too-long'),
  }),
);

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search');
  const take = Number(url.searchParams.get('take') ?? 5);

  if (!search) return json([]);

  try {
    const ingredients = await db.ingredient.findMany({
      where: { name: { contains: search } },
      take,
    });

    return json([...ingredients]);
  } catch (err) {
    console.error(err);
    return json([]);
  }
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const { data, error } = await ingredientValidator.validate(formData);
  if (error) return validationError(error);

  // Validate ingredient with same name doesn't exist already
  const existing = await db.ingredient.findUnique({
    where: { name: data.name },
  });
  if (existing)
    return validationError({
      fieldErrors: {
        name: 'recipe:form.dialogs.new-ingredient.errors.ingredient-exists',
      },
    });

  try {
    const ingredient = await db.ingredient.create({ data });
    return json(ingredient);
  } catch (err) {
    return validationError({
      fieldErrors: {
        name: 'recipe:form.dialogs.new-ingredient.errors.create-failed',
      },
    });
  }
}

export type IngredientsAction = typeof action;
