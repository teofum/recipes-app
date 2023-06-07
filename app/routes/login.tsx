import type { ActionArgs, V2_MetaFunction } from '@remix-run/node';
import { useRouteError, useSearchParams } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import type { FieldErrors } from 'remix-validated-form';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';
import RouteError from '~/components/RouteError';
import { LinkButton } from '~/components/ui/Button';

import Form from '~/components/ui/Form';

import { login } from '~/server/session.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Login | CookBook' }];
};

const validator = withZod(
  z.object({
    usernameOrEmail: z.string().min(1, 'Please enter a username or email'),
    password: z.string().min(1, 'Please enter a password'),
    redirectUrl: z.string().optional(),
  }),
);

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  try {
    const { data, error } = await validator.validate(formData);
    if (error) return validationError(error, formData);

    return await login(data.usernameOrEmail, data.password, data.redirectUrl);
  } catch (err: unknown) {
    return validationError({ fieldErrors: err as FieldErrors }, formData);
  }
}

export default function LoginRoute() {
  const [params] = useSearchParams();
  const redirectUrl = params.get('redirectUrl');

  return (
    <div className="min-h-screen grid place-items-center bg-green-300 bg-dots bg-repeat px-4">
      <div className="card flex flex-col max-w-sm w-full">
        <h1 className="font-display text-4xl font-semibold text-center">
          Login
        </h1>

        <Form.Root validator={validator} method="post" className="mt-4 mb-2">
          <Form.Input
            type="hidden"
            name="redirectUrl"
            id="redirect"
            defaultValue={redirectUrl ?? '/recipes'}
          />

          <Form.Field>
            <Form.Label htmlFor="user">Username/Email</Form.Label>
            <Form.Input type="text" name="usernameOrEmail" id="user" />
            <Form.Error name="usernameOrEmail" id="user" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Input type="password" name="password" id="password" />
            <Form.Error name="password" id="password" />
          </Form.Field>
          <Form.SubmitButton variant="filled">Log in</Form.SubmitButton>
        </Form.Root>

        <LinkButton to={`/register?redirectUrl=${redirectUrl}`}>
          I don't have an account
        </LinkButton>
        <LinkButton to={`/forgotPassword?redirectUrl=${redirectUrl}`}>
          I forgot my password
        </LinkButton>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}

