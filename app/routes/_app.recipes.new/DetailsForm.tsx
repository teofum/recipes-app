import Form from '~/components/ui/Form';

import { TimePickerFormInput } from '~/components/ui/TimePicker';
import { DESCRIPTION_MAX_LENGTH } from './constants';
import Select from '~/components/ui/Select';
import { Visibility } from '@prisma/client';
import { EyeNoneIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

const visibilityDescription = {
  PUBLIC:
    '(NOT IMPLEMENTED) The recipe may be shown to other users. Only you can edit.',
  UNLISTED:
    'Anyone with the link can view. Will not be shown to other users. Only you can edit.',
  PRIVATE: 'Only you can view and edit this recipe.',
};

export default function DetailsForm() {
  const [visibility, setVisibility] = useState<Visibility>(Visibility.UNLISTED);

  return (
    <div className="card">
      <h2 className="card-heading text-2xl">About this recipe</h2>

      <div className="flex flex-col gap-2 -mt-2">
        <Form.Field>
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
          <TimePickerFormInput name="prepTime" id="timeInput" />
          <Form.Error name="prepTime" id="timeInput" />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="visibility">Visibility</Form.Label>
          <Form.Select
            name="visibility"
            defaultValue={Visibility.UNLISTED}
            onValueChange={(value) => setVisibility(value as Visibility)}
          >
            <Select.Item value={Visibility.UNLISTED}>
              <div className="flex flex-row items-center gap-2">
                <EyeNoneIcon /> Unlisted
              </div>
            </Select.Item>
            <Select.Item value={Visibility.PRIVATE}>
              <div className="flex flex-row items-center gap-2">
                <LockClosedIcon /> Private
              </div>
            </Select.Item>
          </Form.Select>
          <Form.Error name="visibility" id="visibility" />
          <p className="text-xs text-stone-600">
            {visibilityDescription[visibility]}
          </p>
        </Form.Field>

        <Form.SubmitButton
          className="w-full mt-4"
          variant={{ size: 'lg', style: 'filled' }}
        >
          Create recipe
        </Form.SubmitButton>
      </div>
    </div>
  );
}
