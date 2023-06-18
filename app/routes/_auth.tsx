import { Outlet } from '@remix-run/react';
import LanguageSelect from '~/components/ui/LanguageSelect';

export default function AuthRoute() {
  return (
    <div
      className="
        min-h-screen flex flex-col items-center justify-center gap-4 px-4
        bg-[url('/img/bg-kitchen.webp')] bg-cover
      "
    >
      <Outlet />

      <div
        className="
          card p-2 surface max-w-sm w-full
          sm:fixed sm:top-8 sm:right-8 sm:w-40
        "
      >
        <LanguageSelect />
      </div>
    </div>
  );
}
