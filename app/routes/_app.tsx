import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { RouteMatch } from '@remix-run/react';
import { useRouteError } from '@remix-run/react';
import { Form, Outlet, useLoaderData, useMatches } from '@remix-run/react';
import cn from 'classnames';
import { useState } from 'react';
import RouteError from '~/components/RouteError';
import { SidenavIcon } from '~/components/icons';
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

  const [expanded, setExpanded] = useState(true);

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      <header
        className="
          flex flex-row items-center p-2 h-14
          bg-white border-b border-black border-opacity-10
          row-start-1 row-span-1 col-start-1 lg:col-[1/span_2]
        "
      >
        <div className="flex flex-row gap-2 w-60 items-center z-20">
          <div className="w-7" />

          <div className="flex-1 font-display text-3xl text-center">
            Cook
            <span className="text-green-700">Book</span>
          </div>

          <Button
            variant={{ type: 'icon' }}
            onClick={() => setExpanded(!expanded)}
          >
            <SidenavIcon />
          </Button>
        </div>
      </header>

      <div
        className={cn(
          'col-start-1 col-span-1 row-start-1 row-span-2 h-full overflow-hidden transition-all',
          {
            'w-0': !expanded,
            'w-64': expanded,
          },
        )}
      >
        <aside
          className="
          p-4 border-r border-black border-opacity-10
          bg-white bg-opacity-70 backdrop-blur-lg h-full w-64
          z-10 relative
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
      </div>

      <div className="overflow-y-auto row-start-2 row-span-1 col-start-1 lg:col-start-2">
        <Outlet />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
