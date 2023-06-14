import { useState } from 'react';
import { Visibility } from '@prisma/client';
import { useField } from 'remix-validated-form';

import Form from '~/components/ui/Form';
import { TimePickerFormInput } from '~/components/ui/TimePicker';

import { DESCRIPTION_MAX_LENGTH } from './constants';
import { visibility } from '~/types/visibility.type';
import { LinkButton } from '../ui/Button';
import { useMatches } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

interface DetailsFormProps {
  mode?: 'create' | 'edit';
}

export default function DetailsForm({ mode = 'create' }: DetailsFormProps) {
  const matches = useMatches();
  const recipeId = matches.at(-1)?.params.recipeId;

  const visibilityField = useField('visibility');
  const prepTimeField = useField('prepTime');
  const [description, setDescription] = useState(visibility[0].description);

  const { t } = useTranslation();

  return (
    <>
      <Form.Field className="border-t pt-4">
        <Form.Label htmlFor="description">
          {t('recipe:form.fields.description.label')}
        </Form.Label>
        <Form.Textarea
          maxLength={DESCRIPTION_MAX_LENGTH}
          name="description"
          id="description"
        />
        <Form.Error name="description" id="description" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="timeInput">
          {t('recipe:form.fields.prep-time.label')}
        </Form.Label>
        <TimePickerFormInput
          name="prepTime"
          id="timeInput"
          defaultValue={prepTimeField.defaultValue}
        />
        <Form.Error name="prepTime" id="timeInput" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="visibility">
          {t('recipe:form.fields.visibility.label')}
        </Form.Label>
        <Form.Select
          name="visibility"
          defaultValue={visibilityField.defaultValue ?? Visibility.UNLISTED}
          onValueChange={(value) =>
            setDescription(
              visibility.find((v) => v.value === value)?.description ?? '',
            )
          }
        >
          {visibility.map((v) => (
            <Form.SelectItem key={v.value} value={v.value}>
              <div className="flex flex-row items-center gap-2">
                <v.icon /> {v.name}
              </div>
            </Form.SelectItem>
          ))}
        </Form.Select>
        <Form.Error name="visibility" id="visibility" />
        <p className="text-xs text-light">{description}</p>
      </Form.Field>

      <Form.SubmitButton
        className="w-full mt-4"
        variant={{ size: mode === 'edit' ? 'md' : 'lg', style: 'filled' }}
      >
        {mode === 'edit'
          ? t('recipe:form.actions.save')
          : t('recipe:form.actions.create')}
      </Form.SubmitButton>

      {mode === 'edit' ? (
        <LinkButton to={`/recipes/${recipeId}`}>
          {t('recipe:form.actions.discard')}
        </LinkButton>
      ) : null}
    </>
  );
}
