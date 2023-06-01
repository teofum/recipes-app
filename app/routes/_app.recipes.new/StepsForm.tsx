import { useFieldArray } from 'remix-validated-form';

import Button from '~/components/ui/Button';
import Form from '~/components/ui/Form';

import { STEP_MAX_LENGTH } from './constants';
import { Cross1Icon, PlusCircledIcon } from '@radix-ui/react-icons';

interface StepField {
  key: string;
  content: string;
}

let key = 0;

export default function StepsForm() {
  const [steps, { push, remove }] = useFieldArray<StepField>('steps');

  return (
    <div className="card">
      <h2 className="card-heading">Preparation</h2>

      <div className="flex flex-col">
        {steps.map((step, index) => {
          const id = `step-${index}`;

          return (
            <Form.Field
              key={step.key}
              className="flex flex-row gap-2 items-start group"
            >
              <div className="self-stretch flex-shrink-0 flex flex-col items-center">
                <Form.Label
                  htmlFor={id}
                  className="
                    w-6 h-6 rounded-full text-sm font-medium
                    bg-green-50 text-green-500 border border-green-500
                    flex items-center justify-center
                  "
                >
                  {index + 1}
                </Form.Label>
                <div className="w-px flex-1 bg-green-500 group-last-of-type:bg-transparent" />
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
            push({ content: '', key: key++ });
          }}
        >
          <PlusCircledIcon />
          Add step
        </Button>
      </div>
    </div>
  );
}
