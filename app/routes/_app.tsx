import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { RouteMatch } from '@remix-run/react';
import { useRouteError } from '@remix-run/react';
import { Form, Outlet, useLoaderData, useMatches } from '@remix-run/react';
import RouteError from '~/components/RouteError';
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
  const matches = useMatches();
  const currentRoute = matches.at(-1) as RouteMatch;

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
            <div className="flex flex-col gap-2">
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
              </div>
              <div className="flex flex-row gap-1">
                <LinkButton
                  to={`/account`}
                  variant={{ size: 'sm' }}
                  className="flex-1"
                >
                  Account
                </LinkButton>
                <Form
                  method="post"
                  action={`/logout?redirectUrl=${currentRoute.pathname}`}
                  className="flex-1"
                >
                  <Button
                    type="submit"
                    variant={{ size: 'sm' }}
                    className="w-full"
                  >
                    Logout
                  </Button>
                </Form>
              </div>
            </div>
          ) : (
            <LinkButton to={`/login?redirectUrl=${currentRoute.pathname}`}>
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

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
