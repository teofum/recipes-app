import type { RouteMatch } from '@remix-run/react';
import { useMatches } from '@remix-run/react';
import { LinkButton } from './Button';
import {
  DashboardIcon,
  FilePlusIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';
import Avatar from './Avatar';
import type { User } from '~/types/user.type';
import { useTranslation } from 'react-i18next';

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
      className="flex-1 flex-col gap-1"
      variant={{
        color: route === currentRoute.pathname ? 'default' : 'neutral',
      }}
    >
      {icon}
      <div className="text-xs">{text}</div>
    </LinkButton>
  );
}

interface MobileNavbarProps {
  user: User | null;
}

export default function MobileNavbar({ user }: MobileNavbarProps) {
  const matches = useMatches();
  const currentRoute = matches.at(-1) as RouteMatch;

  const { t } = useTranslation();

  return (
    <nav className="h-full flex flex-row items-center justify-center px-4">
      <NavbarLink
        currentRoute={currentRoute}
        route="/recipes"
        text={t('app:mobile-nav.my-recipes')}
        icon={<DashboardIcon />}
      />
      <NavbarLink
        currentRoute={currentRoute}
        route="/recipes/find"
        text={t('app:mobile-nav.find')}
        icon={<MagnifyingGlassIcon />}
      />
      <NavbarLink
        currentRoute={currentRoute}
        route="/recipes/new"
        text={t('app:mobile-nav.new')}
        icon={<FilePlusIcon />}
      />

      {user !== null ? (
        <LinkButton
          to="/account"
          className="
            ml-2 -mt-3 rounded-full p-0.5 z-10 relative
            bg-surface
            hover:bg-surface hover:border-neutral-5
          "
        >
          <div className="absolute bg-surface top-[8.5px] -bottom-1 -left-1 -right-1" />
          <Avatar
            src={user.avatarUrl}
            size="lg"
            className="relative z-20"
            alt={user.displayName}
          />
        </LinkButton>
      ) : (
        <LinkButton to="/login">
          <Avatar alt="No user" />
        </LinkButton>
      )}
    </nav>
  );
}
