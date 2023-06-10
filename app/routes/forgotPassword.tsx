import type { ActionArgs, V2_MetaFunction } from '@remix-run/node';
import { useRouteError, useSearchParams } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import type { FieldErrors } from 'remix-validated-form';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';
import RouteError from '~/components/RouteError';

import Form from '~/components/ui/Form';

import { sendRecoveryEmail } from '~/server/notification.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Forgot Password | CookBook' }];
};

const validator = withZod(
  z.object({
    usernameOrEmail: z.string().min(1, 'Please enter your username or email'),
    redirectUrl: z.string().optional(),
  }),
);

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  try {
    const { data, error } = await validator.validate(formData);
    if (error) return validationError(error, formData);

    return await sendRecoveryEmail(data.usernameOrEmail, data.redirectUrl);
  } catch (err) {
    if (err instanceof Error) throw err;
    return validationError({ fieldErrors: err as FieldErrors }, formData);
  }
}

export default function ForgotPasswordRoute() {
  const [params] = useSearchParams();
  const redirectUrl = params.get('redirectUrl');

  return (
    <div className="min-h-screen grid place-items-center bg-primary-2 bg-dots bg-repeat px-4">
      <div className="card flex flex-col gap-4 max-w-sm w-full">
        <h1 className="font-display text-4xl font-semibold text-center">
          Reset your password
        </h1>

        <p className="text-sm text-light">
          Forgot your password? No problem! Just enter your username or email
          and we'll send you a one-time reset code.
        </p>

        <Form.Root validator={validator} method="post">
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
          <Form.SubmitButton variant="filled">Send code</Form.SubmitButton>
        </Form.Root>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
