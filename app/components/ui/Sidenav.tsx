import type { RouteMatch } from '@remix-run/react';
import { Form } from '@remix-run/react';
import { useMatches } from '@remix-run/react';
import {
  DashboardIcon,
  FilePlusIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';
import cn from 'classnames';

import Avatar from './Avatar';
import Button, { LinkButton } from './Button';
import type { User } from '~/types/user.type';

type SidenavProps = React.PropsWithChildren<{ user: User | null }>;

interface SidenavLinkProps {
  currentRoute: RouteMatch;
  route: string;
  text: string;
  icon: React.ReactNode;
}

function SidenavLink({ currentRoute, route, text, icon }: SidenavLinkProps) {
  return (
    <LinkButton
      to={route}
      className={cn(
        'p-1 gap-2 justify-start rounded-lg transition duration-300',
        {
          'bg-green-50': currentRoute.pathname === route,
        },
      )}
    >
      <div className="p-2 rounded bg-green-400 bg-opacity-10">{icon}</div>
      <span>{text}</span>
    </LinkButton>
  );
}

export default function Sidenav({ user }: SidenavProps) {
  const matches = useMatches();
  const currentRoute = matches.at(-1) as RouteMatch;

  return (
    <div className="flex flex-col h-full">
      <div className="hidden xl:flex flex-row items-center h-14 -mt-4">
        <div className="flex-1 font-display text-3xl leading-none text-center">
          Cook
          <span className="text-green-700">Book</span>
        </div>
      </div>

      <nav>
        <ul className="flex flex-col gap-1 mt-10 xl:mt-0">
          <li>
            <SidenavLink
              currentRoute={currentRoute}
              route="/recipes"
              text="My Recipes"
              icon={<DashboardIcon />}
            />
          </li>
          <li>
            <SidenavLink
              currentRoute={currentRoute}
              route="/recipes/find"
              text="Recipe Finder"
              icon={<MagnifyingGlassIcon />}
            />
          </li>
          <li>
            <SidenavLink
              currentRoute={currentRoute}
              route="/recipes/new"
              text="New Recipe"
              icon={<FilePlusIcon />}
            />
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-black border-opacity-10">
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
      </div>
    </div>
  );
}
