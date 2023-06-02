import type { ActionArgs } from '@remix-run/node';
import { logout } from '~/server/session.server';

export const action = async ({ request }: ActionArgs) => {
  const url = new URL(request.url);
  const redirectUrl = url.searchParams.get('redirectUrl');

  return await logout(request, redirectUrl ?? undefined);
};

export default function LogoutRoute() {
  return <div>Bye!</div>;
}
