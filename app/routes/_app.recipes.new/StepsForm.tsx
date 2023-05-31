import { useFieldArray } from 'remix-validated-form';

import Button from '~/components/ui/Button';
import Form from '~/components/ui/Form';

import { STEP_MAX_LENGTH } from './constants';

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

      <div className="flex flex-col gap-4">
        {steps.map((step, index) => {
          const id = `step-${index}`;

          return (
            <Form.Field
              key={step.key}
              className="flex flex-row gap-2 items-start"
            >
              <Form.Label
                htmlFor={id}
                className="
                          w-10 h-10 rounded-full bg-green-50
                          border border-green-700
                          grid place-items-center
                          font-display text-2xl text-green-700
                        "
              >
                {index + 1}
              </Form.Label>
              <div className="flex flex-col gap-1 flex-1">
                <Form.Textarea
                  maxLength={STEP_MAX_LENGTH}
                  name={`steps[${index}].content`}
                  id={id}
                />
                <Form.Error name={`steps[${index}].content`} id={id} />
              </div>
              <Button onClick={() => remove(index)}>Delete</Button>
            </Form.Field>
          );
        })}

        <Button
          onClick={(ev) => {
            ev.preventDefault();
            push({ content: '', key: key++ });
          }}
        >
          Add step
        </Button>
      </div>
    </div>
  );
}
