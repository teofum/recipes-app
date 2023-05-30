import { Unit } from '@prisma/client';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { useFieldArray, validationError } from 'remix-validated-form';
import { z } from 'zod';

import Button from '~/components/ui/Button';
import Form from '~/components/ui/Form';
import Select from '~/components/ui/Select';

import { db } from '~/server/db.server';
import { requireLogin } from '~/server/session.server';
import { units } from '~/types/unit.type';

const validator = withZod(
  z.object({
    name: z.string(),
    description: z.string(),
    ingredients: z.array(
      z.object({
        id: z.string(),
        amount: z.coerce.number(),
        unit: z.enum([Unit.GRAMS, Unit.LITERS, Unit.UNITS]),
      }),
    ),
    steps: z.array(
      z.object({
        content: z.string(),
      }),
    ),
  }),
);

export async function action({ request }: ActionArgs) {
  const userId = await requireLogin(request);
  const formData = await request.formData();

  const { data, error } = await validator.validate(formData);
  if (error) return validationError(error, formData);

  const recipe = await db.recipe.create({
    data: {
      name: data.name,
      description: data.description,
      prepTime: 15,
      authorId: userId,
      imageUrl: '',

      ingredients: {
        create: data.ingredients.map((ingredient) => ({
          ingredientId: ingredient.id,
          amount: ingredient.amount,
          unit: ingredient.unit,
        })),
      },

      steps: {
        create: data.steps.map((step, index) => ({
          content: step.content,
          stepNumber: index + 1,
        })),
      },
    },
  });
  if (!recipe) throw 'fuck';

  return redirect(`/app/recipes/${recipe.id}`);
}

export async function loader({ request }: LoaderArgs) {
  await requireLogin(request);

  /**
   * Just return all ingredients and let the frontend do the filtering work
   * This is a terrible idea and won't scale well at all, check out
   * https://www.algolia.com/doc/ when time comes to implement a proper search
   */
  const allIngredients = await db.ingredient.findMany();

  return json({ allIngredients });
}

interface Step {
  key: string;
  content: string;
}

interface Ingredient {
  key: string;
  id: string;
}

let key = 0;
let iKey = 0;

export default function RecipesRoute() {
  const { allIngredients } = useLoaderData<typeof loader>();

  const [steps, stepsControl] = useFieldArray<Step>('steps', {
    formId: 'new-recipe-form',
  });

  const [ingredients, ingredientsControl] = useFieldArray<Ingredient>(
    'ingredients',
    {
      formId: 'new-recipe-form',
    },
  );

  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 lg:px-8">
      <div className="my-8">
        <h1 className="font-display text-4xl">New recipe</h1>

        <Form.Root validator={validator} method="post" id="new-recipe-form">
          <Form.Field>
            <Form.Input name="name" id="name" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="description">Description</Form.Label>
            <Form.Input name="description" id="description" />
          </Form.Field>

          <h2 className="font-display text-2xl">Ingredients</h2>

          {ingredients.map((ingredient, index) => {
            return (
              <div key={ingredient.key} className="flex flex-row gap-2">
                <Select.Root
                  name={`ingredients[${index}].id`}
                  defaultValue={ingredient.id}
                  triggerProps={{ className: 'flex-1' }}
                  contentProps={{
                    position: 'popper',
                    side: 'bottom',
                    sideOffset: -40,
                    className: 'w-[var(--radix-select-trigger-width)]',
                  }}
                >
                  {allIngredients.map((ingredient) => (
                    <Select.Item key={ingredient.id} value={ingredient.id}>
                      {ingredient.name}
                    </Select.Item>
                  ))}
                </Select.Root>

                <Form.Input
                  className="w-24"
                  name={`ingredients[${index}].amount`}
                  id={`ingredients-${index}-amt`}
                  type="numeric"
                />

                <Select.Root
                  name={`ingredients[${index}].unit`}
                  triggerProps={{ className: 'w-24' }}
                >
                  {units.map((unit) => (
                    <Select.Item key={unit.type} value={unit.type}>
                      {unit.shortName}
                    </Select.Item>
                  ))}
                </Select.Root>

                <Button onClick={() => ingredientsControl.remove(index)}>
                  Delete
                </Button>
              </div>
            );
          })}

          <Button
            onClick={() => ingredientsControl.push({ name: '', key: iKey++ })}
          >
            Add ingredient
          </Button>

          <h2 className="font-display text-2xl">Steps</h2>

          {steps.map((step, index) => {
            const id = `step-${index}`;
            return (
              <Form.Field key={step.key}>
                <Form.Label htmlFor={id}>Step {index}</Form.Label>
                <div className="flex flex-row gap-2">
                  <Form.Input name={`steps[${index}].content`} id={id} />
                  <Button onClick={() => stepsControl.remove(index)}>
                    Delete
                  </Button>
                </div>
              </Form.Field>
            );
          })}

          <Button
            onClick={(ev) => {
              ev.preventDefault();
              stepsControl.push({ content: '', key: key++ });
            }}
          >
            Add step
          </Button>

          <Form.SubmitButton>Submit</Form.SubmitButton>
        </Form.Root>
      </div>
    </div>
  );
}
