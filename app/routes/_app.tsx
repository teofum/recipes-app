import { ExitIcon } from '@radix-ui/react-icons';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Outlet, useLoaderData, useMatches } from '@remix-run/react';
import Avatar from '~/components/ui/Avatar';
import Button, { LinkButton } from '~/components/ui/Button';
import Navbar from '~/components/ui/Navbar';
import { getUser } from '~/server/session.server';

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  return json({ user });
}

export default function AppRoute() {
  const { user } = useLoaderData<typeof loader>();
  const [, , { pathname }] = useMatches();

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-[auto_1fr]">
      <aside
        className="
          p-6
          border lg:border-0 lg:border-r
          border-black border-opacity-10
          bg-white
          rounded-xl lg:rounded-none
          fixed top-4 left-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] sm:w-64
          lg:static lg:h-full
          z-20
        "
      >
        <Navbar>
          {user !== null ? (
            <div className="flex flex-row gap-2 items-center">
              <Avatar alt={user.displayName} />
              <div className="flex-1">
                <div className="font-semibold leading-5">
                  {user.displayName}
                </div>
                <div className="text-xs text-stone-500 leading-5">
                  @{user.username}
                </div>
              </div>
              <Form method="post" action={`/logout?redirectUrl=${pathname}`}>
                <Button type="submit" variant={{ type: 'icon', size: 'lg' }}>
                  <ExitIcon />
                </Button>
              </Form>
            </div>
          ) : (
            <LinkButton to={`/login?redirectUrl=${pathname}`}>
              Sign in
            </LinkButton>
          )}
        </Navbar>
      </aside>
      <div className="overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
