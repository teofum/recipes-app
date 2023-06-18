import type { V2_MetaFunction } from '@remix-run/node';
import { Outlet, useLocation } from '@remix-run/react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';

const stepPathnames = [
  '/register',
  '/register/email',
  '/register/password',
  '/register/profile',
];

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Register | CookBook' }];
};

export const handle = { i18n: 'register' };

export default function RegisterRoute() {
  const location = useLocation();
  const { t } = useTranslation();

  const step = stepPathnames.indexOf(location.pathname);

  return (
    <div className="card surface flex flex-col gap-4 max-w-sm w-full">
      <h1 className="font-display text-4xl font-semibold text-center">
        {t('register:title')}
      </h1>
      <div className="flex flex-row gap-0.5 p-0.5 bg-white bg-opacity-30 rounded-full">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn('w-4 h-1 rounded-full transition-all duration-300', {
              'bg-primary-2': i < step,
              'bg-primary flex-1': i === step,
              'bg-neutral-3': i > step,
            })}
          />
        ))}
      </div>

      <Outlet />
    </div>
  );
}
