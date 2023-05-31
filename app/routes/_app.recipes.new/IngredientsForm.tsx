import { Unit } from '@prisma/client';
import { useFetcher } from '@remix-run/react';
import { useFieldArray } from 'remix-validated-form';
import { Delete } from '~/components/icons';

import Button from '~/components/ui/Button';
import FetcherComboBox from '~/components/ui/FetcherComboBox';
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
  const fetcher = useFetcher<Ingredient[]>();
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
              <FetcherComboBox
                name={`ingredients[${index}].id`}
                defaultValue={ingredient.id}
                triggerProps={{ className: 'flex-1' }}
                endpoint={(search) => `/api/ingredients?search=${search}`}
                fetcher={fetcher}
                valueSelector={(item) => item.id}
                displaySelector={(item) => item.name}
              />

              <Form.Input
                className="w-24 -mr-2 rounded-r-none border-r-0"
                name={`ingredients[${index}].amount`}
                id={`ingredients-${index}-amt`}
              />

              <Form.Select
                name={`ingredients[${index}].unit`}
                triggerProps={{ className: 'w-24 rounded-l-none' }}
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
                <Delete size="sm" />
              </Button>
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
