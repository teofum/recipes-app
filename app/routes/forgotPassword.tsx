import type { ActionArgs, V2_MetaFunction } from '@remix-run/node';
import { useRouteError, useSearchParams } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { useTranslation } from 'react-i18next';
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
    usernameOrEmail: z
      .string()
      .min(1, 'forgot:forgot.validation.username-or-email.required'),
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

export const handle = { i18n: 'forgot' };

export default function ForgotPasswordRoute() {
  const [params] = useSearchParams();
  const redirectUrl = params.get('redirectUrl');

  const { t } = useTranslation();

  return (
    <div className="min-h-screen grid place-items-center bg-primary-2 bg-dots bg-repeat px-4">
      <div className="card flex flex-col gap-4 max-w-sm w-full">
        <h1 className="font-display text-4xl font-semibold text-center">
          {t('forgot:title')}
        </h1>

        <p className="text-sm text-light">{t('forgot:forgot.description')}</p>

        <Form.Root validator={validator} method="post">
          <Form.Input
            type="hidden"
            name="redirectUrl"
            id="redirect"
            defaultValue={redirectUrl ?? '/recipes'}
          />

          <Form.Field>
            <Form.Label htmlFor="user">
              {t('forgot:forgot.fields.username-or-email')}
            </Form.Label>
            <Form.Input type="text" name="usernameOrEmail" id="user" />
            <Form.Error name="usernameOrEmail" id="user" />
          </Form.Field>
          <Form.SubmitButton variant="filled">
            {t('forgot:forgot.actions.send')}
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
