import { json, type ActionArgs } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';
import { i18nextCookie } from '~/server/i18n.server';

export const languageValidator = withZod(
  z.object({
    lang: z.enum(['en', 'es']),
  }),
);

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const { error, data } = await languageValidator.validate(formData);
  if (error) return validationError(error);

  const cookieHeader = await i18nextCookie.serialize(data.lang);
  return json(data, {
    headers: { 'Set-Cookie': cookieHeader },
  });
}
