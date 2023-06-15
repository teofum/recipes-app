import type { V2_MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Register | CookBook' }];
};

export const handle = { i18n: 'register' };

export default function RegisterRoute() {
  const { t } = useTranslation();

  return (
    <div
      className="
        min-h-screen grid place-items-center px-4
        bg-[url('/img/bg-kitchen.webp')] bg-cover
      "
    >
      <div className="card surface flex flex-col gap-4 max-w-sm w-full">
        <h1 className="font-display text-4xl font-semibold text-center">
          {t('register:title')}
        </h1>

        <Outlet />
      </div>
    </div>
  );
}
