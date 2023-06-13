import type { LinksFunction, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';

import styles from '~/styles/tailwind.css';
import RouteError from './components/RouteError';
import i18next from './server/i18n.server';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from 'remix-i18next';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export async function loader({ request }: LoaderArgs) {
  const locale = await i18next.getLocale(request);
  return json({ locale });
}

export const handle = {
  i18n: 'common',
};

function Document({ children }: React.PropsWithChildren<{}>) {
  const { locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();

  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-default">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <Document>
      <RouteError error={error} />
    </Document>
  );
}
