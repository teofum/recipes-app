import type { ActionArgs } from '@remix-run/node';
import { logout } from '~/server/session.server';

export const action = async ({ request }: ActionArgs) => {
  return await logout(request);
};

export default function LogoutRoute() {
  return <div>Bye!</div>;
}
