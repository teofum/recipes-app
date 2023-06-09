import {
  DashboardIcon,
  FilePlusIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';
import { LinkButton } from './Button';
import cn from 'classnames';
import type { RouteMatch } from '@remix-run/react';
import { useMatches } from '@remix-run/react';

type NavbarProps = React.PropsWithChildren<{}>;

interface NavbarLinkProps {
  currentRoute: RouteMatch;
  route: string;
  text: string;
  icon: React.ReactNode;
}

function NavbarLink({ currentRoute, route, text, icon }: NavbarLinkProps) {
  return (
    <LinkButton
      to={route}
      className={cn('p-1 gap-2 justify-start rounded-lg transition duration-300', {
        'bg-green-50': currentRoute.pathname === route,
      })}
    >
      <div className="p-2 rounded bg-green-400 bg-opacity-10">{icon}</div>
      <span>{text}</span>
    </LinkButton>
  );
}

export default function Navbar({ children }: NavbarProps) {
  const matches = useMatches();
  const currentRoute = matches.at(-1) as RouteMatch;

  return (
    <div className="flex flex-col h-full">
      <nav>
        <ul className="mt-10 flex flex-col gap-1">
          <li>
            <NavbarLink
              currentRoute={currentRoute}
              route="/recipes"
              text="My Recipes"
              icon={<DashboardIcon />}
            />
          </li>
          <li>
            <NavbarLink
              currentRoute={currentRoute}
              route="/recipes/find"
              text="Recipe Finder"
              icon={<MagnifyingGlassIcon />}
            />
          </li>
          <li>
            <NavbarLink
              currentRoute={currentRoute}
              route="/recipes/new"
              text="New Recipe"
              icon={<FilePlusIcon />}
            />
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-black border-opacity-10">
        {children}
      </div>
    </div>
  );
}
