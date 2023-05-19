import type { ActionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { validateFields } from '~/form/formFields.server';
import { badRequest } from '~/server/request.server';
import { login } from '~/server/session.server';

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  try {
    const { usernameOrEmail, password } = validateFields(formData, {
      usernameOrEmail: 'string',
      password: 'string',
    });

    return await login(usernameOrEmail, password);
  } catch (err: unknown) {
    return badRequest({
      formError: (err as Error).message,
    });
  }
}

export default function LoginRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h1>Login</h1>
      <Form method="post">
        <label>
          <input type="text" name="usernameOrEmail" />
        </label>
        <label>
          <input type="password" name="password" />
        </label>
        <button type="submit">Submit</button>
      </Form>

      <p className="text-red-700">{actionData?.formError}</p>
    </div>
  );
}
