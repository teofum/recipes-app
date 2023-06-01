import { DashboardIcon, FilePlusIcon } from '@radix-ui/react-icons';
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
      className={cn('py-2 px-4 justify-start rounded-lg transition', {
        'bg-green-100': currentRoute.pathname === route,
      })}
    >
      {icon}
      <span>{text}</span>
    </LinkButton>
  );
}

export default function Navbar({ children }: NavbarProps) {
  const [, , child] = useMatches();

  return (
    <div className="flex flex-col h-full">
      <div className="font-display text-4xl text-center">
        Cook
        <span className="text-green-700">Book</span>
      </div>

      <nav>
        <ul className="mt-6 flex flex-col gap-1">
          <li>
            <NavbarLink
              currentRoute={child}
              route="/recipes"
              text="My Recipes"
              icon={<DashboardIcon />}
            />
          </li>
          <li>
            <NavbarLink
              currentRoute={child}
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
