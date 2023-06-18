import { useState } from 'react';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLocation, useRouteError } from '@remix-run/react';
import { Outlet, useLoaderData } from '@remix-run/react';
import cn from 'classnames';

import { SidenavIcon } from '~/components/icons';
import RouteError from '~/components/RouteError';
import Button, { LinkButton } from '~/components/ui/Button';
import Sidenav from '~/components/ui/Sidenav';

import { getUser } from '~/server/session.server';
import MobileNavbar from '~/components/ui/MobileNavbar';
import { useTranslation } from 'react-i18next';
import Avatar from '~/components/ui/Avatar';

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  return json({ user });
}

export const handle = { i18n: 'app' };

export default function AppRoute() {
  const { user } = useLoaderData<typeof loader>();
  const location = useLocation();

  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="
        h-screen grid grid-cols-1 grid-rows-[1fr_auto]
        sm:grid-rows-1
        xl:grid-cols-[auto_1fr]
      "
    >
      {/* Sidenav, shown on sm+, collapsible until xl+  */}
      <div
        className={cn(
          'hidden sm:block',
          'col-start-1 col-span-1 row-start-1 h-full z-20',
          'overflow-hidden transition-all',
          {
            'w-0 xl:w-64': !expanded,
            'w-64': expanded,
          },
        )}
      >
        <aside className="p-4 border-r surface h-full w-64">
          <Sidenav user={user} />
        </aside>
      </div>

      {/* Overlay to close sidenav on click */}
      <div
        className={cn('hidden fixed inset-0 z-[15]', { 'sm:block': expanded })}
        onClick={() => setExpanded(false)}
      />

      {/* Logo and sidenav control, shown on top of header */}
      <div
        className="
          hidden sm:flex xl:hidden
          fixed top-0 left-0 w-60 h-14 z-20
          flex-row gap-4 px-4 items-center
        "
      >
        <Button
          className="xl:hidden"
          variant={{ type: 'icon' }}
          onClick={() => setExpanded(!expanded)}
        >
          <SidenavIcon />
        </Button>

        <div className="flex-1 font-display text-3xl leading-none">
          Cook
          <span className="text-primary-high">Book</span>
        </div>
      </div>

      {/* Main content */}
      <div
        className="
          overflow-y-auto row-span-1 row-start-1 col-start-1
          xl:col-start-2
        "
      >
        {/* Header, shown on sm+, hidden again on xl+ */}
        <header
          className="
            hidden sm:flex xl:hidden
            sticky top-0 z-10 col-start-1 row-start-1
            flex-row items-center p-4 pl-60 h-14
            surface-thick border-b
          "
        >
          <div className="ml-auto">
            {user !== null ? (
              <LinkButton to="/account" className="rounded-full p-0.5">
                <div className="ml-4 mr-1 text-default">{user.displayName}</div>
                <Avatar src={user.avatarUrl} alt={user.displayName} />
              </LinkButton>
            ) : (
              <LinkButton to={`/login?redirectUrl=${location.pathname}`}>
                {t('session.login')}
              </LinkButton>
            )}
          </div>
        </header>

        <Outlet />
      </div>

      {/* Mobile navbar, hidden on sm+ */}
      <div className="h-16 sm:hidden bg-surface border-t">
        <MobileNavbar user={user} />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
