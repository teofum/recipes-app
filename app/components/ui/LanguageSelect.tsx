import { useLocale } from 'remix-i18next';
import { useFetcher } from '@remix-run/react';
import Form from './Form';
import { useFormContext } from 'remix-validated-form';
import { languageValidator } from '~/routes/api.lang';
import { useTranslation } from 'react-i18next';

type Props = {
  withLabel?: boolean;
} & Omit<
  React.ComponentProps<typeof Form.Select>,
  'value' | 'onValueChange' | 'name' | 'id'
>;

export default function LanguageSelect({ withLabel = false, ...props }: Props) {
  const { submit } = useFormContext('_lang-form');
  const locale = useLocale();
  const fetcher = useFetcher();

  const { t } = useTranslation();

  return (
    <Form.Root
      method="post"
      action="/api/lang"
      validator={languageValidator}
      fetcher={fetcher}
      id="_lang-form"
    >
      <Form.Field>
        {withLabel ? <Form.Label>{t('lang.label')}</Form.Label> : null}
        <Form.Select
          {...props}
          name="lang"
          defaultValue={locale}
          onValueChange={submit}
        >
          <Form.SelectItem value="en">English</Form.SelectItem>
          <Form.SelectItem value="es">Español</Form.SelectItem>
        </Form.Select>
      </Form.Field>
    </Form.Root>
  );
}
