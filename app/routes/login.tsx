import type { ActionArgs } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import type { FieldErrors } from 'remix-validated-form';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';

import Form from '~/components/ui/Form';

import { login } from '~/server/session.server';

const validator = withZod(
  z.object({
    usernameOrEmail: z.string(),
    password: z.string(),
  }),
);

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  try {
    const { data, error } = await validator.validate(formData);
    if (error) return validationError(error, formData);

    return await login(data.usernameOrEmail, data.password);
  } catch (err: unknown) {
    return validationError({ fieldErrors: err as FieldErrors }, formData);
  }
}

export default function LoginRoute() {
  return (
    <div className="min-h-screen grid place-items-center bg-green-300 bg-dots bg-repeat">
      <div className="card flex flex-col gap-4 max-w-sm w-full">
        <h1 className="font-display text-4xl font-semibold text-center">
          Login
        </h1>

        <Form.Root validator={validator} method="post">
          <Form.Field>
            <Form.Label htmlFor="user">Username/Email</Form.Label>
            <Form.Input type="text" name="usernameOrEmail" id="user" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Input type="password" name="password" id="password" />
          </Form.Field>
          <Form.SubmitButton>Log in</Form.SubmitButton>
        </Form.Root>
      </div>
    </div>
  );
}
