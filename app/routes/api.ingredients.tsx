import type { Language } from '@prisma/client';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';
import algoliaAdmin from '~/server/algolia.server';

import { db } from '~/server/db.server';
import i18next from '~/server/i18n.server';

// Use a different Algolia index for dev/prod
const dev = process.env.NODE_ENV !== 'production';

// Validator
export const ingredientValidator = withZod(
  z.object({
    name: z
      .string()
      .min(1, 'recipe:form.dialogs.new-ingredient.validation.name.required')
      .max(40, 'recipe:form.dialogs.new-ingredient.validation.name.too-long'),
    lang: z.string().optional(),
  }),
);

/**
 * GET /api/ingredients
 * Returns ingredient matches for a search param
 * @deprecated Deprecated, search using Algolia instead
 */
export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search');
  const take = Number(url.searchParams.get('take') ?? 5);
  const locale = (url.searchParams.get('lang') ||
    (await i18next.getLocale(request))) as Language;

  if (!search) return json([]);

  try {
    const ingredients = await db.ingredient.findMany({
      where: { name: { contains: search }, language: locale },
      take,
    });

    return json([...ingredients]);
  } catch (err) {
    console.error(err);
    return json([]);
  }
}

/**
 * POST /api/ingredients
 * Create a new ingredient in the database and add it to Algolia index
 */
export async function action({ request }: ActionArgs) {
  // Parse and validate form data
  const formData = await request.formData();
  const { data, error } = await ingredientValidator.validate(formData);
  if (error) return validationError(error);

  // Get locale, specified in request body if editing a recipe
  // This allows editing recipes in a different language than the app's
  // New recipes are always created in the app's UI language at the time of creation
  const locale = (data.lang || (await i18next.getLocale(request))) as Language;

  // Validate ingredient with same name doesn't exist already
  const existing = await db.ingredient.findFirst({
    where: { name: data.name, language: locale },
  });
  if (existing)
    return validationError({
      fieldErrors: {
        name: 'recipe:form.dialogs.new-ingredient.errors.ingredient-exists',
      },
    });

  // Create the ingredient
  try {
    // Create the new ingredient in database
    const ingredient = await db.ingredient.create({
      data: { name: data.name, language: locale },
    });

    // Add it to the Algolia index
    let indexName = `ingredients_${locale}`;
    if (dev) indexName += '_dev';
    const index = algoliaAdmin.initIndex(indexName);

    await index.saveObject({
      objectID: ingredient.id,
      language: ingredient.language,
      name: ingredient.name,
    });

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
