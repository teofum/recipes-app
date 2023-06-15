import { type ActionArgs, redirect } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import { useTranslation } from 'react-i18next';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';

import Form from '~/components/ui/Form';
import { db } from '~/server/db.server';

const validator = withZod(
  z.object({
    email: z.string().email('register:validation.email.invalid'),
  }),
);

export async function action({ request }: ActionArgs) {
  const url = new URL(request.url);
  const formData = await request.formData();

  const { data, error } = await validator.validate(formData);
  if (error) return validationError(error, formData);

  // Check if the username is taken
  const existingUser = await db.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser)
    return validationError(
      { fieldErrors: { email: 'register:errors.email-taken' } },
      formData,
    );

  url.searchParams.set('email', data.email);
  return redirect(`/register/password${url.search}`);
}

export const handle = { i18n: 'register' };

export default function RegisterRoute() {
  const { t } = useTranslation();

  return (
    <Form.Root method="post" validator={validator}>
      <Form.Field>
        <Form.Label htmlFor="email">
          {t('register:fields.email.label')}
        </Form.Label>
        <Form.Input
          autoFocus
          id="email"
          type="text"
          name="email"
          placeholder="you@example.com"
        />
        <Form.Error id="email" name="email" />
        <Form.HintText>{t('register:fields.email.hint')}</Form.HintText>
      </Form.Field>

      <Form.SubmitButton variant="filled">
        {t('register:actions.next')}
      </Form.SubmitButton>
    </Form.Root>
  );
}
