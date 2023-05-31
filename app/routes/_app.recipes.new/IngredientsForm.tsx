import { useFieldArray } from 'remix-validated-form';

import Button from '~/components/ui/Button';
import Form from '~/components/ui/Form';
import Select from '~/components/ui/Select';

import type { Ingredient } from '~/types/ingredient.type';
import { units } from '~/types/unit.type';

interface IngredientField {
  key: string;
  id: string;
}

let key = 0;

interface IngredientsFormProps {
  allIngredients: Ingredient[];
}

export default function IngredientsForm({
  allIngredients,
}: IngredientsFormProps) {
  const [ingredients, { push, remove }] =
    useFieldArray<IngredientField>('ingredients');

  return (
    <div className="card">
      <h2 className="card-heading">Ingredients</h2>

      <div className="flex flex-col gap-2">
        {ingredients.map((ingredient, index) => {
          return (
            <div
              key={ingredient.key}
              className="flex flex-row gap-2 items-center"
            >
              <Form.Select
                name={`ingredients[${index}].id`}
                defaultValue={ingredient.id}
                triggerProps={{ className: 'flex-1' }}
                contentProps={{
                  position: 'popper',
                  side: 'bottom',
                  sideOffset: -34,
                  className: 'w-[var(--radix-select-trigger-width)]',
                }}
              >
                {allIngredients.map((ingredient) => (
                  <Select.Item key={ingredient.id} value={ingredient.id}>
                    {ingredient.name}
                  </Select.Item>
                ))}
              </Form.Select>

              <Form.Input
                className="w-24"
                name={`ingredients[${index}].amount`}
                id={`ingredients-${index}-amt`}
              />

              <Form.Select
                name={`ingredients[${index}].unit`}
                triggerProps={{ className: 'w-24' }}
              >
                {units.map((unit) => (
                  <Select.Item key={unit.type} value={unit.type}>
                    {unit.shortName}
                  </Select.Item>
                ))}
              </Form.Select>

              <Button onClick={() => remove(index)}>Delete</Button>
            </div>
          );
        })}

        <Button onClick={() => push({ name: '', key: key++ })}>
          Add ingredient
        </Button>
      </div>
    </div>
  );
}
