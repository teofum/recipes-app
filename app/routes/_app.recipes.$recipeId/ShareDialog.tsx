import { useState } from 'react';
import { Visibility } from '@prisma/client';

import Button from '~/components/ui/Button';
import Dialog from '~/components/ui/Dialog';
import Form from '~/components/ui/Form';
import type { Recipe } from '~/types/recipe.type';

import { manageRecipeValidator } from './route';
import {
  CheckCircledIcon,
  CopyIcon,
  EyeNoneIcon,
  LockClosedIcon,
} from '@radix-ui/react-icons';
import Select from '~/components/ui/Select';

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
    <Dialog
      trigger={
        <Button>
          Share
        </Button>
      }
      title="Share"
    >
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
          <div className="flex flex-row gap-2">
            <Form.Select
              name="visibility"
              defaultValue={recipe.visibility}
              triggerProps={{ className: 'flex-1' }}
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
            <Form.SubmitButton variant="filled">
              Change visibility
            </Form.SubmitButton>
          </div>
        </Form.Field>
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
