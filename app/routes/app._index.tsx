import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { getUser } from '~/server/session.server';

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  return json({ user });
}

export default function AppIndexRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Welcome {user?.username ?? 'Anon'}</h1>
      <Form action="/logout" method="post">
        <button type="submit">Logout</button>
      </Form>
    </div>
  );
}
