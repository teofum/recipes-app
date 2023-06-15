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
    .min(1, 'recipe:form.validation.name.required')
    .max(NAME_MAX_LENGTH, 'recipe:form.validation.name.too-long'),
  description: z
    .string()
    .min(1, 'recipe:form.validation.description.required')
    .max(DESCRIPTION_MAX_LENGTH, 'recipe:form.validation.description.too-long'),
  visibility: z.enum([
    Visibility.PUBLIC,
    Visibility.UNLISTED,
    Visibility.PRIVATE,
  ]),
  prepTime: z.coerce.number().min(0),
  image: z.instanceof(File).optional(),
  ingredients: z.array(
    z.object({
      id: z.string(),
      name: z.string(), // Not written to DB, only used to render optimistic UI
      amount: z.coerce
        .number()
        .min(1, 'recipe:form.validation.ingredients.amount-too-low'),
      unit: z.enum([Unit.GRAMS, Unit.LITERS, Unit.UNITS]),
    }),
    { required_error: 'recipe:form.validation.ingredients.required' }
  ),
  steps: z.array(
    z.object({
      id: z.string(),
      content: z
        .string()
        .min(1, 'recipe:form.validation.step.required')
        .max(STEP_MAX_LENGTH, 'recipe:form.validation.step.too-long'),
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
