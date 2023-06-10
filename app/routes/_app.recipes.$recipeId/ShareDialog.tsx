import { useState } from 'react';
import { Visibility } from '@prisma/client';
import { CheckCircledIcon, CopyIcon } from '@radix-ui/react-icons';

import Button from '~/components/ui/Button';
import Dialog from '~/components/ui/Dialog';
import Form from '~/components/ui/Form';
import type { Recipe } from '~/types/recipe.type';
import { visibility } from '~/types/visibility.type';

import { manageRecipeValidator } from '~/routes/_app.recipes.$recipeId/route';

interface Props {
  recipe: Recipe;
}

export default function ShareDialog({ recipe }: Props) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://recipes.fumagalli.ar/recipes/${recipe.id}`;
  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  };

  return (
    <Dialog trigger={<Button>Share</Button>} title="Share">
      <Form.Root
        validator={manageRecipeValidator}
        method="post"
        className="mt-2"
      >
        <Form.Input
          type="hidden"
          name="recipeId"
          id="recipeId"
          value={recipe.id}
        />
        <Form.Input
          type="hidden"
          name="authorId"
          id="authorId"
          value={recipe.authorId}
        />
        <Form.Input
          type="hidden"
          name="intent"
          id="intentSetVisibility"
          value="setVisibility"
        />

        <Form.Field>
          <Form.Label>Visibility</Form.Label>
          <Form.RadioGroup name="visibility" defaultValue={recipe.visibility}>
            {visibility.map((v) => (
              <Form.RadioButton
                key={v.value}
                value={v.value}
                id={`visibility_${v.value}`}
              >
                <div className="flex flex-row items-center gap-2">
                  <div className="p-2 bg-primary-5 rounded">
                    <v.icon className="text-primary-high" />
                  </div>
                  <div>
                    <div className="font-medium">{v.name}</div>
                    <div className="text-xs text-light">
                      {v.description}
                    </div>
                  </div>
                </div>
              </Form.RadioButton>
            ))}
          </Form.RadioGroup>
        </Form.Field>

        <Form.SubmitButton variant="filled">Save</Form.SubmitButton>
      </Form.Root>

      {recipe.visibility !== Visibility.PRIVATE ? (
        <Form.Field className="mt-3">
          <Form.Label>Share a link</Form.Label>
          <div className="flex flex-row">
            <input
              className="input select-all rounded-e-none border-r-0 flex-1 text-xs"
              value={shareUrl}
              disabled
            />
            <Button
              variant="filled"
              className="rounded-s-none w-28"
              onClick={copyLink}
            >
              {copied ? <CheckCircledIcon /> : <CopyIcon />}
              {copied ? 'Copied' : 'Copy link'}
            </Button>
          </div>
        </Form.Field>
      ) : null}
    </Dialog>
  );
}
