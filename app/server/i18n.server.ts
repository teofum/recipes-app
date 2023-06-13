import I18NexFsBackend from 'i18next-fs-backend';
import { resolve } from 'node:path';
import { RemixI18Next } from 'remix-i18next';
import i18n from '~/i18n';

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
  },
  i18next: {
    ...i18n,
    backend: {
      loadPath: resolve('./public/i18n/{{lng}}/{{ns}}.json'),
    },
  },
  backend: I18NexFsBackend
});

export default i18next;
