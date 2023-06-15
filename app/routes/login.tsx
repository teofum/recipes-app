import type { ActionArgs, V2_MetaFunction } from '@remix-run/node';
import { useRouteError, useSearchParams } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { useTranslation } from 'react-i18next';
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
    usernameOrEmail: z
      .string()
      .min(1, 'login:validation.username-or-email.required'),
    password: z.string().min(1, 'login:validation.password.required'),
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

export const handle = { i18n: 'login' };

export default function LoginRoute() {
  const [params] = useSearchParams();
  const redirectUrl = params.get('redirectUrl');

  const { t } = useTranslation();

  return (
    <div
      className="
        min-h-screen grid place-items-center px-4
        bg-[url('/img/bg-kitchen.webp')] bg-cover
      "
    >
      <div className="card surface flex flex-col max-w-sm w-full">
        <h1 className="font-display text-4xl font-semibold text-center">
          {t('login:title')}
        </h1>

        <Form.Root validator={validator} method="post" className="mt-4 mb-2">
          <Form.Input
            type="hidden"
            name="redirectUrl"
            id="redirect"
            defaultValue={redirectUrl ?? '/recipes'}
          />

          <Form.Field>
            <Form.Label htmlFor="user">
              {t('login:fields.username-or-email')}
            </Form.Label>
            <Form.Input type="text" name="usernameOrEmail" id="user" />
            <Form.Error name="usernameOrEmail" id="user" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="password">
              {t('login:fields.password')}
            </Form.Label>
            <Form.Input type="password" name="password" id="password" />
            <Form.Error name="password" id="password" />
          </Form.Field>
          <Form.SubmitButton variant="filled">
            {t('session.login')}
          </Form.SubmitButton>
        </Form.Root>

        <LinkButton to={`/register?redirectUrl=${redirectUrl}`}>
          {t('login:actions.register')}
        </LinkButton>
        <LinkButton to={`/forgotPassword?redirectUrl=${redirectUrl}`}>
          {t('login:actions.forgot')}
        </LinkButton>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
