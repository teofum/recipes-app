import type { ActionArgs, V2_MetaFunction } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import type { FieldErrors } from 'remix-validated-form';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';

import Form from '~/components/ui/Form';

import { register } from '~/server/session.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Register | CookBook' }];
};

const validator = withZod(
  z.object({
    email: z.string().email('Must be a valid email address'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters long')
      .max(20, 'Username must be at most 20 characters long')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Username may only contain alphanumeric characters, underscores, and hyphens',
      ),
    displayName: z
      .string()
      .min(3, 'Display name must be at least 3 characters long')
      .max(20, 'Display name must be at most 20 characters long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters in length'),
  }),
);

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  try {
    const { data, error } = await validator.validate(formData);
    if (error) return validationError(error, formData);

    return await register(
      data.username,
      data.displayName,
      data.email,
      data.password,
    );
  } catch (err: unknown) {
    return validationError({ fieldErrors: err as FieldErrors }, formData);
  }
}

export default function RegisterRoute() {
  return (
    <div className="min-h-screen grid place-items-center bg-primary-2 bg-dots bg-repeat px-4">
      <div className="card flex flex-col gap-4 max-w-sm w-full">
        <h1 className="font-display text-4xl font-semibold text-center">
          Register
        </h1>

        <Form.Root method="post" validator={validator}>
          <Form.Field>
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Input id="email" type="text" name="email" />
            <Form.Error id="email" name="email" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Input id="username" type="text" name="username" />
            <Form.Error id="username" name="username" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="displayName">Display Name</Form.Label>
            <Form.Input id="displayName" type="text" name="displayName" />
            <Form.Error id="displayName" name="displayName" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Input id="password" type="password" name="password" />
            <Form.Error id="password" name="password" />
          </Form.Field>

          <Form.SubmitButton>Register</Form.SubmitButton>
        </Form.Root>
      </div>
    </div>
  );
}
