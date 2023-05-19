import type { ActionArgs } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { validateFields } from '~/form/formFields.server';
import { badRequest } from '~/server/request.server';
import { register } from '~/server/session.server';

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  try {
    const data = validateFields(formData, {
      username: 'string',
      displayName: 'string',
      email: 'string',
      password: 'string',
    });

    return await register(
      data.username,
      data.displayName,
      data.email,
      data.password,
    );
  } catch (err: unknown) {
    return badRequest({
      formError: (err as Error).message,
    });
  }
}

export default function RegisterRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h1>Register</h1>
      <form method="post">
        <div>
          <label>
            Email
            <input className="border" type="email" name="email" />
          </label>
        </div>
        <div>
          <label>
            Username
            <input className="border" type="text" name="username" />
          </label>
        </div>
        <div>
          <label>
            Display Name
            <input className="border" type="text" name="displayName" />
          </label>
        </div>
        <div>
          <label>
            Password
            <input className="border" type="password" name="password" />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>

      <p className="text-red-700">{actionData?.formError}</p>
    </div>
  );
}
