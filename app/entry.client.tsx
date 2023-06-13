import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import I18NextHttpBackend from 'i18next-http-backend';
import { getInitialNamespaces } from 'remix-i18next';

import i18n from '~/i18n';

async function hydrate() {
  await i18next
    .use(initReactI18next)
    .use(I18nextBrowserLanguageDetector)
    .use(I18NextHttpBackend)
    .init({
      ...i18n,
      ns: getInitialNamespaces(),
      backend: { loadPath: '/i18n/{{lng}}/{{ns}}.json' },
      detection: {
        order: ['htmlTag'],
        caches: [],
      },
    });

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          <RemixBrowser />
        </StrictMode>
      </I18nextProvider>,
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  window.setTimeout(hydrate, 1); // Safari
}
