import { useState } from 'react';
import { Visibility } from '@prisma/client';
import { useField } from 'remix-validated-form';

import Form from '~/components/ui/Form';
import { TimePickerFormInput } from '~/components/ui/TimePicker';

import { DESCRIPTION_MAX_LENGTH } from './constants';
import { visibility } from '~/types/visibility.type';
import { LinkButton } from '../ui/Button';
import { useMatches } from '@remix-run/react';

interface DetailsFormProps {
  mode?: 'create' | 'edit';
}

export default function DetailsForm({ mode = 'create' }: DetailsFormProps) {
  const matches = useMatches();
  const recipeId = matches.at(-1)?.params.recipeId;

  const visibilityField = useField('visibility');
  const prepTimeField = useField('prepTime');
  const [description, setDescription] = useState(visibility[0].description);

  return (
    <>
      <Form.Field className="border-t border-black border-opacity-10 pt-4">
        <Form.Label htmlFor="description">Description</Form.Label>
        <Form.Textarea
          maxLength={DESCRIPTION_MAX_LENGTH}
          name="description"
          id="description"
        />
        <Form.Error name="description" id="description" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="timeInput">Preparation time</Form.Label>
        <TimePickerFormInput
          name="prepTime"
          id="timeInput"
          defaultValue={prepTimeField.defaultValue}
        />
        <Form.Error name="prepTime" id="timeInput" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="visibility">Visibility</Form.Label>
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
        <p className="text-xs text-stone-600">{description}</p>
      </Form.Field>

      <Form.SubmitButton
        className="w-full mt-4"
        variant={{ size: mode === 'edit' ? 'md' : 'lg', style: 'filled' }}
      >
        {mode === 'edit' ? 'Save changes' : 'Create recipe'}
      </Form.SubmitButton>

      {mode === 'edit' ? (
        <LinkButton to={`/recipes/${recipeId}`}>Discard changes</LinkButton>
      ) : null}
    </>
  );
}
