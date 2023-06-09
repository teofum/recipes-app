import { useState } from 'react';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useRouteError } from '@remix-run/react';
import { Outlet, useLoaderData } from '@remix-run/react';
import cn from 'classnames';

import { SidenavIcon } from '~/components/icons';
import RouteError from '~/components/RouteError';
import Button from '~/components/ui/Button';
import Sidenav from '~/components/ui/Sidenav';

import { getUser } from '~/server/session.server';
import MobileNavbar from '~/components/ui/MobileNavbar';

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  return json({ user });
}

export default function AppRoute() {
  const { user } = useLoaderData<typeof loader>();

  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="
        h-screen grid grid-cols-1 grid-rows-[1fr_auto]
        sm:grid-rows-[auto_1fr]
        xl:grid-cols-[auto_1fr]
      "
    >
      {/* Header, shown on sm+, hidden again on xl+ */}
      <header
        className="
          hidden sm:flex xl:hidden
          flex-row items-center p-2 h-14
          bg-white border-b border-black border-opacity-10
          row-start-1 row-span-1 col-start-1
          xl:col-[1/span_2]
        "
      >
        <div className="flex flex-row gap-2 w-60 items-center z-20">
          <div className="w-7 xl:hidden" />

          <div className="flex-1 font-display text-3xl leading-none text-center">
            Cook
            <span className="text-green-700">Book</span>
          </div>

          <Button
            className="xl:hidden"
            variant={{ type: 'icon' }}
            onClick={() => setExpanded(!expanded)}
          >
            <SidenavIcon />
          </Button>
        </div>
      </header>

      {/* Sidenav, shown on sm+, collapsible until xl+  */}
      <div
        className={cn(
          'hidden sm:block',
          'col-start-1 col-span-1 row-start-1 row-span-2 h-full z-10',
          'overflow-hidden transition-all',
          {
            'w-0 xl:w-64': !expanded,
            'w-64': expanded,
          },
        )}
      >
        <aside
          className="
            p-4 border-r border-black border-opacity-10
            bg-white bg-opacity-70 backdrop-blur-lg h-full w-64
          "
        >
          <Sidenav user={user} />
        </aside>
      </div>

      {/* Main content */}
      <div
        className="
          overflow-y-auto row-span-1 row-start-1 col-start-1
          sm:row-start-2
          xl:col-start-2
        "
      >
        <Outlet />
      </div>

      {/* Mobile navbar, hidden on sm+ */}
      <div className="h-16 sm:hidden bg-white border-t border-black border-opacity-10">
        <MobileNavbar />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
