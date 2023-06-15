import { type ActionArgs, redirect } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import { useTranslation } from 'react-i18next';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';

import Form from '~/components/ui/Form';
import { db } from '~/server/db.server';

const validator = withZod(
  z.object({
    username: z
      .string()
      .min(3, 'register:validation.username.too-short')
      .max(20, 'register:validation.username.too-long')
      .regex(/^[a-zA-Z0-9_-]+$/, 'register:validation.username.characters'),
  }),
);

export async function action({ request }: ActionArgs) {
  const url = new URL(request.url);
  const formData = await request.formData();

  const { data, error } = await validator.validate(formData);
  if (error) return validationError(error, formData);

  // Check if the username is taken
  const existingUser = await db.user.findUnique({
    where: { username: data.username },
  });
  if (existingUser)
    return validationError(
      { fieldErrors: { username: 'register:errors.username-taken' } },
      formData,
    );

  url.searchParams.set('username', data.username);
  return redirect(`/register/email${url.search}`);
}

export default function RegisterRoute() {
  const { t } = useTranslation();

  return (
    <Form.Root method="post" validator={validator}>
      <Form.Field>
        <Form.Label htmlFor="username">
          {t('register:fields.username.label')}
        </Form.Label>
        <Form.Input
          autoFocus
          id="username"
          type="text"
          name="username"
          placeholder="user123"
        />
        <Form.Error id="username" name="username" />
        <Form.HintText>{t('register:fields.username.hint')}</Form.HintText>
      </Form.Field>

      <Form.SubmitButton variant="filled">
        {t('register:actions.next')}
      </Form.SubmitButton>
    </Form.Root>
  );
}
