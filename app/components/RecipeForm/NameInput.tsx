import { useTranslation } from 'react-i18next';

import Form from '~/components/ui/Form';
import { NAME_MAX_LENGTH } from './constants';

export default function NameInput() {
  const { t } = useTranslation();

  return (
    <Form.Field className="sm:self-end">
      <Form.Error name="name" id="name" />
      <Form.Input
        name="name"
        id="name"
        placeholder={t('recipe:form.fields.name.placeholder') ?? undefined}
        maxLength={NAME_MAX_LENGTH}
        autoFocus
        className="
          font-display text-4xl md:text-5xl lg:text-6xl
          min-w-0 w-full
          p-0 bg-transparent !border-none
          focus-visible:bg-transparent
          placeholder:text-default placeholder:text-opacity-50
          aria-[invalid]:bg-danger-4
        "
      />
    </Form.Field>
  );
}
