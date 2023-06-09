import { Visibility, Unit } from '@prisma/client';
import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';

import {
  NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  STEP_MAX_LENGTH,
} from './constants';

const schema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(
      NAME_MAX_LENGTH,
      `Name must be at most ${NAME_MAX_LENGTH} characters long`,
    ),
  description: z
    .string()
    .min(1, 'A description is required')
    .max(
      DESCRIPTION_MAX_LENGTH,
      `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters long`,
    ),
  visibility: z.enum([
    Visibility.PUBLIC,
    Visibility.UNLISTED,
    Visibility.PRIVATE,
  ]),
  prepTime: z.coerce.number().min(0),
  imageUrl: z.string().optional(),
  ingredients: z.array(
    z.object({
      id: z.string(),
      name: z.string(), // Not written to DB, only used to render optimistic UI
      amount: z.coerce.number().min(1, 'Cannot have zero of an ingredient'),
      unit: z.enum([Unit.GRAMS, Unit.LITERS, Unit.UNITS]),
    }),
  ),
  steps: z.array(
    z.object({
      content: z
        .string()
        .min(1, 'Step content is required')
        .max(
          STEP_MAX_LENGTH,
          `Description must be at most ${STEP_MAX_LENGTH} characters long`,
        ),
    }),
  ),
});

export const newRecipeValidator = withZod(schema);

// Validator debug code
// const v = newRecipeValidator.validate;
// const vf = newRecipeValidator.validateField;

// newRecipeValidator.validate = async (data) => {
//   console.log('validating form', [...data.entries()]);
//   const res = await v(data);
//   console.log('validated form', res);
//   return res;
// };

// newRecipeValidator.validateField = async (data, field) => {
//   console.log(`validating ${field}`, [...data.entries()]);
//   const res = await vf(data, field);
//   console.log(`validated ${field}`, res);
//   return res;
// };