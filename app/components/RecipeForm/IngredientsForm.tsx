import { Unit } from '@prisma/client';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useFieldArray } from 'remix-validated-form';

import Button from '~/components/ui/Button';
import Form from '~/components/ui/Form';

import { units } from '~/types/unit.type';
import IngredientsComboBox from './IngredientsComboBox';

interface IngredientField {
  id: string;
  name: string;
}

export default function IngredientsForm() {
  const [ingredients, { push, remove }] =
    useFieldArray<IngredientField>('ingredients');

  const addIngredient = (id: string, name: string) => {
    if (!ingredients.some((ingredient) => ingredient.id === id))
      push({ id, name });
  };

  return (
    <div className="card">
      <h2 className="card-heading">Ingredients</h2>

      <div className="flex flex-col gap-2">
        {ingredients.map((ingredient, index) => {
          return (
            <div
              key={ingredient.id}
              className="flex flex-row gap-2 items-center"
            >
              <Form.Input
                type="hidden"
                name={`ingredients[${index}].id`}
                id={`ingredients[${index}]-id`}
                value={ingredient.id}
              />
              <Form.Input
                type="hidden"
                name={`ingredients[${index}].name`}
                id={`ingredients[${index}]-name`}
                value={ingredient.name}
              />

              <div className="text-sm flex-1">{ingredient.name}</div>

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
                  <Form.SelectItem key={unit.type} value={unit.type}>
                    {unit.fullName}
                  </Form.SelectItem>
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

        <IngredientsComboBox onSelect={addIngredient} />
      </div>
    </div>
  );
}
