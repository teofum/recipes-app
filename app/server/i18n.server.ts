import { createCookie } from '@remix-run/node';
import I18NextFsBackend from 'i18next-fs-backend';
import { resolve } from 'node:path';
import { RemixI18Next } from 'remix-i18next';
import i18n from '~/i18n';

export const i18nextCookie = createCookie('i18next');

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
    cookie: i18nextCookie,
  },
  i18next: {
    ...i18n,
    backend: {
      loadPath: resolve('./public/i18n/{{lng}}/{{ns}}.json'),
    },
  },
  backend: I18NextFsBackend,
});

export default i18next;
