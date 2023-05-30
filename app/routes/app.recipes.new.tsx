import { Unit } from '@prisma/client';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { useFieldArray, validationError } from 'remix-validated-form';
import { z } from 'zod';

import Button from '~/components/ui/Button';
import Form from '~/components/ui/Form';
import Select from '~/components/ui/Select';

import { db } from '~/server/db.server';
import { requireLogin } from '~/server/session.server';
import { units } from '~/types/unit.type';

const DESCRIPTION_MAX_LENGTH = 140;
const STEP_MAX_LENGTH = 140;

const validator = withZod(
  z.object({
    name: z.string(),
    description: z
      .string()
      .min(1, 'A description is required')
      .max(
        DESCRIPTION_MAX_LENGTH,
        `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters long`,
      ),
    ingredients: z.array(
      z.object({
        id: z.string(),
        amount: z.coerce.number(),
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
  }),
);

const v = validator.validate;
const vf = validator.validateField;

validator.validate = (data: any) => {
  console.log('validating', data);
  return v(data);
};

validator.validateField = (data: any, field: string) => {
  console.log('validating', field, data);
  return vf(data, field);
};

export async function action({ request }: ActionArgs) {
  const userId = await requireLogin(request);
  const formData = await request.formData();

  const { data, error } = await validator.validate(formData);
  if (error) return validationError(error, formData);

  console.log(data);
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
    <div className="w-full">
      <div
        className="
          relative w-full aspect-video
          bg-stone-900 overflow-hidden
          border-b border-black border-opacity-20
          max-h-64 -mb-40 p-6
        "
      >
        <img
          src="/img/curry.jpg"
          alt="background"
          className="bg-blur opacity-50 mix-blend-hard-light"
        />

        <Link to="/app/recipes" className="relative text-white">
          &lt; Back to recipes
        </Link>
      </div>

      <Form.Root validator={validator} method="post" id="new-recipe-form">
        <div
          className="
            relative w-full max-w-screen-lg mx-auto px-4 lg:px-8 pb-8
            sm:grid sm:grid-cols-[1fr_15rem] sm:grid-rows-[10rem_auto_1fr]
            sm:items-end sm:gap-4
            md:grid-cols-[1fr_20rem]
          "
        >
          <Form.Field>
            <Form.Input
              name="name"
              id="name"
              placeholder="New recipe"
              className="
                font-display text-4xl md:text-5xl lg:text-6xl
                min-w-0 w-full
                p-0 bg-transparent border-none text-white
                focus-visible:bg-transparent
                placeholder:text-white placeholder:text-opacity-50
              "
            />
          </Form.Field>

          <img
            src="/img/curry.jpg"
            alt="background"
            className="
              aspect-video object-cover
              rounded-xl
              outline outline-4 outline-stone-100
              sm:w-full sm:col-start-2 sm:row-span-2 sm:aspect-square
              md:rounded-3xl
            "
          />

          <div
            className="
              sm:col-start-2 sm:row-start-3 sm:self-start
              flex flex-col gap-4
            "
          >
            <div className="card">
              <h2 className="card-heading text-2xl">About this recipe</h2>

              <Form.Field>
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Textarea
                  maxLength={DESCRIPTION_MAX_LENGTH}
                  name="description"
                  id="description"
                />
              </Form.Field>
            </div>
          </div>

          <div
            className="
              sm:col-start-1 sm:row-start-2 sm:row-span-2 sm:self-start
              flex flex-col gap-4
            "
          >
            <div className="card">
              <h2 className="card-heading">Ingredients</h2>

              <div className="flex flex-col gap-2">
                {ingredients.map((ingredient, index) => {
                  return (
                    <div key={ingredient.key} className="flex flex-row gap-2 items-center">
                      <Form.Select
                        name={`ingredients[${index}].id`}
                        defaultValue={ingredient.id}
                        triggerProps={{ className: 'flex-1' }}
                        contentProps={{
                          position: 'popper',
                          side: 'bottom',
                          sideOffset: -34,
                          className: 'w-[var(--radix-select-trigger-width)]',
                        }}
                      >
                        {allIngredients.map((ingredient) => (
                          <Select.Item
                            key={ingredient.id}
                            value={ingredient.id}
                          >
                            {ingredient.name}
                          </Select.Item>
                        ))}
                      </Form.Select>

                      <Form.Input
                        className="w-24"
                        name={`ingredients[${index}].amount`}
                        id={`ingredients-${index}-amt`}
                      />

                      <Form.Select
                        name={`ingredients[${index}].unit`}
                        triggerProps={{ className: 'w-24' }}
                      >
                        {units.map((unit) => (
                          <Select.Item key={unit.type} value={unit.type}>
                            {unit.shortName}
                          </Select.Item>
                        ))}
                      </Form.Select>

                      <Button onClick={() => ingredientsControl.remove(index)}>
                        Delete
                      </Button>
                    </div>
                  );
                })}

                <Button
                  onClick={() =>
                    ingredientsControl.push({ name: '', key: iKey++ })
                  }
                >
                  Add ingredient
                </Button>
              </div>
            </div>

            <div className="card">
              <h2 className="card-heading">Preparation</h2>

              <div className="flex flex-col gap-4">
                {steps.map((step, index) => {
                  const id = `step-${index}`;

                  return (
                    <Form.Field
                      key={step.key}
                      className="flex flex-row gap-2 items-start"
                    >
                      <Form.Label
                        htmlFor={id}
                        className="
                          w-10 h-10 rounded-full bg-green-50
                          border border-green-700
                          grid place-items-center
                          font-display text-2xl text-green-700
                        "
                      >
                        {index + 1}
                      </Form.Label>
                      <div className="flex flex-col gap-1 flex-1">
                        <Form.Textarea
                          maxLength={STEP_MAX_LENGTH}
                          name={`steps[${index}].content`}
                          id={id}
                        />
                        <Form.Error name={`steps[${index}].content`} id={id} />
                      </div>
                      <Button onClick={() => stepsControl.remove(index)}>
                        Delete
                      </Button>
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
              </div>
            </div>

            <Form.SubmitButton>Submit</Form.SubmitButton>
          </div>
        </div>
      </Form.Root>
    </div>
  );
}
