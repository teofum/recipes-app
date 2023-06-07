import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useRouteError } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { useState } from 'react';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';
import RecipeView from '~/components/RecipeView';
import RouteError from '~/components/RouteError';
import Button from '~/components/ui/Button';
import Dialog from '~/components/ui/Dialog';
import Form from '~/components/ui/Form';
import { HoldSubmitButton } from '~/components/ui/HoldButton';

import { db } from '~/server/db.server';
import { deleteRecipe } from '~/server/delete.server';
import { forbidden, notFound } from '~/server/request.server';
import { getUser } from '~/server/session.server';
import type { Recipe } from '~/types/recipe.type';

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.recipe.name ?? 'Recipe'} | CookBook` }];
};

const validator = withZod(
  z.object({
    recipeId: z.string(),
    authorId: z.string(),
    imageUrl: z.string().optional(),
    intent: z.enum(['delete']),
  }),
);

const v = validator.validate;
const vf = validator.validateField;

validator.validate = async (data) => {
  console.log('validating form', [...data.entries()]);
  const res = await v(data);
  console.log('validated form', res);
  return res;
};

validator.validateField = async (data, field) => {
  console.log(`validating ${field}`, [...data.entries()]);
  const res = await vf(data, field);
  console.log(`validated ${field}`, res);
  return res;
};

export async function action({ request }: ActionArgs) {
  const user = await getUser(request);

  const formData = await request.formData();
  const { data, error } = await validator.validate(formData);
  if (error) return validationError(error);

  // Make sure the logged user is definitely authorized
  if (data.authorId !== user?.id)
    throw forbidden({
      message: 'User is not authorized to perform this action.',
    });

  switch (data.intent) {
    case 'delete': {
      await db.$transaction(deleteRecipe(data.recipeId, data.imageUrl));
      return redirect('/recipes');
    }
  }
}

export async function loader({ request, params }: LoaderArgs) {
  const start = Date.now();
  console.log('start');
  const user = await getUser(request);
  console.log('got user at', Date.now() - start, 'ms');

  const recipe = await db.recipe.findUnique({
    include: {
      ingredients: { include: { ingredient: true } },
      steps: true,
      author: true,
    },
    where: { id: params.recipeId },
  });
  if (!recipe) throw notFound({ message: 'Recipe not found' });
  console.log('got recipe at', Date.now() - start, 'ms');

  return json({ recipe, user });
}

function DeleteConfirmationDialog({ recipe }: { recipe: Recipe }) {
  const [confirmation, setConfirmation] = useState('');

  return (
    <Dialog
      trigger={<Button variant={{ color: 'danger' }}>Delete</Button>}
      title="Delete recipe"
      description={
        <>
          Please confirm you want to delete this recipe.{' '}
          <span className="font-medium text-red-600">
            This action is permanent and cannot be undone.
          </span>
        </>
      }
    >
      <Form.Root validator={validator} method="post" className="mt-2">
        <Form.Input
          type="hidden"
          name="recipeId"
          id="recipeId"
          value={recipe.id}
        />
        <Form.Input
          type="hidden"
          name="authorId"
          id="authorId"
          value={recipe.authorId}
        />
        <Form.Input
          type="hidden"
          name="imageUrl"
          id="imageUrl"
          value={recipe.imageUrl ?? undefined}
        />
        <Form.Input
          type="hidden"
          name="intent"
          id="intentDelete"
          value="delete"
        />

        <Form.Field>
          <Form.Label htmlFor="confirmation">
            Type <span className="font-medium">{recipe.name}</span> to confirm
          </Form.Label>
          <Form.Input
            name="confirmation"
            id="confirmation"
            onChange={(ev) => setConfirmation(ev.target.value)}
          />
        </Form.Field>

        <HoldSubmitButton
          variant={{ color: 'danger' }}
          disabled={confirmation !== recipe.name}
        >
          Hold to delete
        </HoldSubmitButton>
      </Form.Root>
    </Dialog>
  );
}

function ManageForm({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex flex-col">
      <DeleteConfirmationDialog recipe={recipe} />
    </div>
  );
}

export default function RecipeRoute() {
  const { recipe, user } = useLoaderData<typeof loader>();

  return (
    <RecipeView
      recipe={recipe}
      user={user}
      manageForm={<ManageForm recipe={recipe} />}
    />
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
