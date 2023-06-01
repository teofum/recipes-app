import { Unit } from '@prisma/client';
import { Cross1Icon, PlusCircledIcon } from '@radix-ui/react-icons';
import { useFieldArray } from 'remix-validated-form';

import Button from '~/components/ui/Button';
import Form from '~/components/ui/Form';
import Select from '~/components/ui/Select';

import { units } from '~/types/unit.type';
import IngredientsComboBox from './IngredientsComboBox';

interface IngredientField {
  key: string;
  id: string;
}

let key = 0;

export default function IngredientsForm() {
  const [ingredients, { push, remove }] =
    useFieldArray<IngredientField>('ingredients');

  return (
    <div className="card">
      <h2 className="card-heading">Ingredients</h2>

      <div className="flex flex-col gap-2">
        {ingredients.map((ingredient, index) => {
          return (
            <div
              key={ingredient.key ?? 'DEFAULT'}
              className="flex flex-row gap-2 items-center"
            >
              <IngredientsComboBox name={`ingredients[${index}].id`} />

              <Form.Input
                className="w-16 -mr-2 rounded-r-none border-r-0"
                name={`ingredients[${index}].amount`}
                id={`ingredients-${index}-amt`}
              />

              <Form.Select
                name={`ingredients[${index}].unit`}
                triggerProps={{ className: 'w-32 rounded-l-none' }}
                defaultValue={Unit.UNITS}
              >
                {units.map((unit) => (
                  <Select.Item key={unit.type} value={unit.type}>
                    {unit.fullName}
                  </Select.Item>
                ))}
              </Form.Select>

              <Button
                variant={{ type: 'icon', color: 'danger' }}
                onClick={() => remove(index)}
              >
                <Cross1Icon />
              </Button>
            </div>
          );
        })}

        <Button onClick={() => push({ name: '', key: key++ })}>
          <PlusCircledIcon />
          Add ingredient
        </Button>
      </div>
    </div>
  );
}
