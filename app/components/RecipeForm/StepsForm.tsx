import type { RecipeStep } from '@prisma/client';
import { Cross1Icon, PlusCircledIcon } from '@radix-ui/react-icons';
import { useFieldArray } from 'remix-validated-form';

import Button from '~/components/ui/Button';
import Form from '~/components/ui/Form';

import { STEP_MAX_LENGTH } from './constants';

let key = 0;

export default function StepsForm() {
  const [steps, { push, remove }] = useFieldArray<RecipeStep>('steps');

  return (
    <div className="card">
      <div className="card-heading">
        <h2>Preparation</h2>
      </div>

      <div className="flex flex-col">
        {steps.map((step, index) => {
          const id = `step-${step.id}`;

          return (
            <Form.Field
              key={step.id ?? 'DEFAULT'}
              className="flex flex-row gap-2 items-start group"
            >
              <Form.Input
                type="hidden"
                name={`steps[${index}].id`}
                id={id + '-id'}
                value={step.id}
              />

              <div className="self-stretch flex-shrink-0 flex flex-col items-center">
                <Form.Label
                  htmlFor={id}
                  className="
                    w-6 h-6 rounded-full text-sm font-medium
                    bg-primary-5 text-primary border border-primary
                    flex items-center justify-center
                  "
                >
                  {index + 1}
                </Form.Label>
                <div className="w-px flex-1 bg-primary group-last-of-type:bg-transparent" />
              </div>
              <div className="flex flex-col gap-1 flex-1 mb-4">
                <Form.Textarea
                  maxLength={STEP_MAX_LENGTH}
                  name={`steps[${index}].content`}
                  id={id}
                />
                <Form.Error name={`steps[${index}].content`} id={id} />
              </div>
              <Button
                variant={{ type: 'icon', color: 'danger' }}
                onClick={() => remove(index)}
              >
                <Cross1Icon />
              </Button>
            </Form.Field>
          );
        })}

        <Button
          onClick={(ev) => {
            ev.preventDefault();
            push({
              id: `step__${key++}`,
              content: '',
            });
          }}
        >
          <PlusCircledIcon />
          Add step
        </Button>
      </div>
    </div>
  );
}
