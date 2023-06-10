import type { ActionArgs, V2_MetaFunction } from '@remix-run/node';
import { useRouteError, useSearchParams } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import type { FieldErrors } from 'remix-validated-form';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';
import RouteError from '~/components/RouteError';
import CodeInput from '~/components/ui/CodeInput';

import Form from '~/components/ui/Form';

import { resetPassword } from '~/server/session.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Reset Password | CookBook' }];
};

const validator = withZod(
  z.object({
    resetCode: z.string().regex(/^[a-zA-Z0-9]{0,6}$/, 'Invalid reset code'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters in length'),
    username: z.string().min(1, 'Username unavailable'),
    redirectUrl: z.string().optional(),
  }),
);

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  try {
    const { data, error } = await validator.validate(formData);
    if (error) return validationError(error, formData);

    return await resetPassword(
      data.username,
      data.resetCode.toUpperCase(),
      data.newPassword,
      data.redirectUrl,
    );
  } catch (err) {
    if (err instanceof Error) throw err;
    return validationError({ fieldErrors: err as FieldErrors }, formData);
  }
}

export default function ResetPasswordRoute() {
  const [params] = useSearchParams();
  const redirectUrl = params.get('redirectUrl');
  const username = params.get('username');
  const obfuscatedEmailAddress = params.get('email');

  return (
    <div className="min-h-screen grid place-items-center bg-primary-2 bg-dots bg-repeat px-4">
      <div className="card flex flex-col gap-4 max-w-sm w-full">
        <h1 className="font-display text-4xl font-semibold text-center">
          Reset your password
        </h1>

        <p className="text-sm text-light">
          We just sent a one-time reset code to your email{' '}
          <span className="text-black font-semibold">
            {obfuscatedEmailAddress}
          </span>
          , valid for the next 15 minutes. Enter the code and a new password.
        </p>

        <Form.Root validator={validator} method="post">
          <Form.Input
            type="hidden"
            name="redirectUrl"
            id="redirect"
            defaultValue={redirectUrl ?? '/recipes'}
          />

          <Form.Input
            type="hidden"
            name="username"
            id="usename"
            defaultValue={username ?? ''}
          />

          <Form.Field>
            <Form.Label htmlFor="resetCode">Reset code</Form.Label>
            <div className="mx-auto">
              <CodeInput name="resetCode" id="resetCode" />
            </div>
            <Form.Error name="resetCode" id="resetCode" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="password">New password</Form.Label>
            <Form.Input
              type="text"
              name="newPassword"
              id="password"
              // Doesn't work for Firefox as of now, but it's the only reasonable
              // workaround to using type=password, which we can't use because
              // browsers are stupid and autofill anything that looks remotely
              // like a login form with no way to tell them not to...
              className="[-webkit-text-security:circle]"
            />
            <Form.Error name="newPassword" id="password" />
          </Form.Field>

          <Form.SubmitButton variant="filled">
            Reset password and sign in
          </Form.SubmitButton>
        </Form.Root>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
