import { ExitIcon } from '@radix-ui/react-icons';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import Avatar from '~/components/ui/Avatar';
import { LinkButton } from '~/components/ui/Button';
import Navbar from '~/components/ui/Navbar';
import { requireUser } from '~/server/session.server';
import { PLACEHOLDER_IMAGE_URL } from './_app.recipes.new/constants';

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);

  return json({ user });
}

export default function AppRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-[auto_1fr]">
      <aside
        className="
          p-6
          border lg:border-0 lg:border-r
          border-black border-opacity-20
          bg-white
          rounded-xl lg:rounded-none
          fixed top-4 left-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] sm:w-64
          lg:static lg:h-full
          z-20
        "
      >
        <Navbar>
          <div className="flex flex-row gap-2 items-center">
            <Avatar src={PLACEHOLDER_IMAGE_URL} alt={user.displayName} />
            <div className="flex-1">
              <div className="font-semibold leading-5">{user.displayName}</div>
              <div className="text-xs text-stone-500 leading-5">
                @{user.username}
              </div>
            </div>
            <LinkButton to="/logout" variant={{ type: 'icon', size: 'lg' }}>
              <ExitIcon />
            </LinkButton>
          </div>
        </Navbar>
      </aside>
      <div className="overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
