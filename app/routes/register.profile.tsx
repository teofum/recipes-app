import type { LoaderArgs, ActionArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { useTranslation } from 'react-i18next';
import type { FieldErrors } from 'remix-validated-form';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';
import { LinkButton } from '~/components/ui/Button';

import Form from '~/components/ui/Form';
import { db } from '~/server/db.server';
import { requireUser } from '~/server/session.server';

const validator = withZod(
  z.object({
    displayName: z
      .string()
      .min(3, 'register:validation.display-name.too-short')
      .max(20, 'register:validation.display-name.too-long'),
  }),
);

export async function action({ request }: ActionArgs) {
  const url = new URL(request.url);
  const user = await requireUser(request, '/register');
  const formData = await request.formData();

  try {
    const { data, error } = await validator.validate(formData);
    if (error) return validationError(error, formData);

    await db.user.update({
      where: { id: user.id },
      data: { displayName: data.displayName },
    });

    const redirectUrl = url.searchParams.get('redirectUrl') || '/recipes';
    return redirect(redirectUrl);
  } catch (err: unknown) {
    return validationError({ fieldErrors: err as FieldErrors }, formData);
  }
}

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request, '/register');

  const url = new URL(request.url);
  const redirectUrl = url.searchParams.get('redirectUrl') || '/recipes';

  return json({ user, redirectUrl });
}

export const handle = { i18n: 'register' };

export default function RegisterRoute() {
  const { user, redirectUrl } = useLoaderData<typeof loader>();

  const { t } = useTranslation();

  return (
    <>
      <Form.Root method="post" validator={validator}>
        <Form.Field>
          <Form.Label htmlFor="displayName">
            {t('register:fields.display-name.label')}
          </Form.Label>
          <Form.Input
            autoFocus
            id="displayName"
            type="text"
            name="displayName"
            defaultValue={user.username}
          />
          <Form.Error id="displayName" name="displayName" />
          <Form.HintText>
            {t('register:fields.display-name.hint')}
          </Form.HintText>
        </Form.Field>

        <Form.SubmitButton variant="filled">
          {t('register:actions.finish')}
        </Form.SubmitButton>
      </Form.Root>
      <LinkButton to={redirectUrl} className="-mt-3">
        {t('register:actions.skip-profile')}
      </LinkButton>
    </>
  );
}
