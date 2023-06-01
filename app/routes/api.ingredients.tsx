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
      .min(1, 'You must provide an ingredient name')
      .max(40, 'Ingredient name must be at most 40 characters long'),
  }),
);

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search');
  const take = Number(url.searchParams.get('take') ?? 5);

  if (!search) return [];

  const ingredients = await db.ingredient.findMany({
    where: { name: { contains: search } },
    take,
  });

  return json([...ingredients]);
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const { data, error } = await ingredientValidator.validate(formData);
  if (error) throw validationError(error);

  const ingredient = await db.ingredient.create({ data });
  return json(ingredient);
}

export type IngredientsAction = typeof action;
