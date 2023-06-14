import type { ActionArgs, V2_MetaFunction } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import { useTranslation } from 'react-i18next';
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
    email: z.string().email('register:validation.email.invalid'),
    username: z
      .string()
      .min(3, 'register:validation.username.too-short')
      .max(20, 'register:validation.username.too-long')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'register:validation.username.characters',
      ),
    displayName: z
      .string()
      .min(3, 'register:validation.display-name.too-short')
      .max(20, 'register:validation.display-name.too-long'),
    password: z
      .string()
      .min(8, 'register:validation.password.too-short'),
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

export const handle = { i18n: 'register' };

export default function RegisterRoute() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen grid place-items-center bg-primary-2 bg-dots bg-repeat px-4">
      <div className="card flex flex-col gap-4 max-w-sm w-full">
        <h1 className="font-display text-4xl font-semibold text-center">
          {t('register:title')}
        </h1>

        <Form.Root method="post" validator={validator}>
          <Form.Field>
            <Form.Label htmlFor="email">
              {t('register:fields.email')}
            </Form.Label>
            <Form.Input id="email" type="text" name="email" />
            <Form.Error id="email" name="email" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="username">
              {t('register:fields.username')}
            </Form.Label>
            <Form.Input id="username" type="text" name="username" />
            <Form.Error id="username" name="username" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="displayName">
              {t('register:fields.display-name')}
            </Form.Label>
            <Form.Input id="displayName" type="text" name="displayName" />
            <Form.Error id="displayName" name="displayName" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="password">
              {t('register:fields.password')}
            </Form.Label>
            <Form.Input id="password" type="password" name="password" />
            <Form.Error id="password" name="password" />
          </Form.Field>

          <Form.SubmitButton>
            {t('register:actions.register')}
          </Form.SubmitButton>
        </Form.Root>
      </div>
    </div>
  );
}
