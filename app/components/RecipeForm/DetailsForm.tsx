import { useState } from 'react';
import { Visibility } from '@prisma/client';

import Form from '~/components/ui/Form';
import { TimePickerFormInput } from '~/components/ui/TimePicker';

import { DESCRIPTION_MAX_LENGTH } from './constants';
import { visibility } from '~/types/visibility.type';

export default function DetailsForm() {
  const [description, setDescription] = useState(visibility[0].description);

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
          variant={{ size: 'lg', style: 'filled' }}
        >
          Create recipe
        </Form.SubmitButton>
      </div>
    </div>
  );
}
