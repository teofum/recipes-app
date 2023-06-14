import { useLocale } from 'remix-i18next';
import { useFetcher } from '@remix-run/react';
import Form from './Form';
import { useFormContext } from 'remix-validated-form';
import { languageValidator } from '~/routes/api.lang';
import { useTranslation } from 'react-i18next';

type Props = Omit<
  React.ComponentProps<typeof Form.Select>,
  'value' | 'onValueChange' | 'name' | 'id'
>;

export default function LanguageSelect(props: Props) {
  const { submit } = useFormContext('_lang-form');
  const locale = useLocale();
  const fetcher = useFetcher();

  const { t } = useTranslation();

  const onLocaleChange = (value: string) => {
    console.log('locale change', value);
    submit();
  };

  return (
    <Form.Root
      method="post"
      action="/api/lang"
      validator={languageValidator}
      fetcher={fetcher}
      id="_lang-form"
    >
      <Form.Field>
        <Form.Label>{t('app:lang.label')}</Form.Label>
        <Form.Select
          {...props}
          name="lang"
          defaultValue={locale}
          onValueChange={onLocaleChange}
        >
          <Form.SelectItem value="en">English</Form.SelectItem>
          <Form.SelectItem value="es">Español</Form.SelectItem>
        </Form.Select>
      </Form.Field>
    </Form.Root>
  );
}
