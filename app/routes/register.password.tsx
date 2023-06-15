import type { ActionArgs } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import { useTranslation } from 'react-i18next';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';

import Form from '~/components/ui/Form';
import { badRequest } from '~/server/request.server';
import { register } from '~/server/session.server';

const validator = withZod(
  z.object({
    password: z.string().min(8, 'register:validation.password.too-short'),
  }),
);

export async function action({ request }: ActionArgs) {
  const url = new URL(request.url);
  const formData = await request.formData();

  const { data, error } = await validator.validate(formData);
  if (error) return validationError(error, formData);

  const username = url.searchParams.get('username');
  const email = url.searchParams.get('email');

  // This should never happen under normal conditions,
  // no need to bother handling it gracefully
  if (!username || !email) throw badRequest('Missing username or email');

  // Get rid of form params, but keep the redirectUrl intact
  url.searchParams.delete('username');
  url.searchParams.delete('email');

  // Register the user with display name = username,
  // we'll let them set it in the next step
  return register(
    username,
    username,
    email,
    data.password,
    `/register/profile${url.search}`,
  );
}

export const handle = { i18n: 'register' };

export default function RegisterRoute() {
  const { t } = useTranslation();

  return (
    <Form.Root method="post" validator={validator}>
      <Form.Field>
        <Form.Label htmlFor="password">
          {t('register:fields.password.label')}
        </Form.Label>
        <Form.Input autoFocus id="password" type="password" name="password" />
        <Form.Error id="password" name="password" />
        <Form.HintText>{t('register:fields.password.hint')}</Form.HintText>
      </Form.Field>

      <Form.SubmitButton variant="filled">
        {t('register:actions.register')}
      </Form.SubmitButton>
    </Form.Root>
  );
}
