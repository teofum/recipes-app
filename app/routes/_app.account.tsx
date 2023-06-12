import { useState } from 'react';
import bcryptjs from 'bcryptjs';

import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import {
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useRouteError } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';

import Avatar from '~/components/ui/Avatar';
import Button from '~/components/ui/Button';
import Dialog from '~/components/ui/Dialog';
import Form from '~/components/ui/Form';
import { db } from '~/server/db.server';
import { requireUser } from '~/server/session.server';
import RouteError from '~/components/RouteError';
import ImageUpload from '~/components/RecipeForm/ImageUpload';
import { MAX_UPLOAD_SIZE } from '~/utils/constants';
import uploadImage, { deleteImage } from '~/server/image.server';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'My Account | CookBook' }];
};

const avatarValidator = withZod(
  z.object({
    image: z.instanceof(File),
  }),
);

const emailValidator = withZod(
  z.object({
    email: z.string().email(),
  }),
);

const userInfoValidator = withZod(
  z.object({
    displayName: z
      .string()
      .min(3, 'Display name must be at least 3 characters long')
      .max(20, 'Display name must be at most 20 characters long'),
  }),
);

const passwordValidator = withZod(
  z.object({
    current: z.string().min(1, 'Please enter your current password'),
    new: z.string().min(8, 'Password must be at least 8 characters in length'),
  }),
);

export async function action({ request }: ActionArgs) {
  const user = await requireUser(request);

  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
  );
  const subaction = formData.get('subaction') as string;

  switch (subaction) {
    case 'avatar': {
      const { data, error } = await avatarValidator.validate(formData);
      if (error) return validationError(error);

      if (user.avatarUrl) await deleteImage(user.avatarUrl);

      const filename = `${user.id}.${Date.now()}.webp`;
      const imageUrl = await uploadImage(data.image, 'avatar', filename, {
        width: 256,
        height: 256,
      });

      const newUser = await db.user.update({
        where: { id: user.id },
        data: { avatarUrl: imageUrl },
      });

      return json(newUser);
    }
    case 'email': {
      const { data, error } = await emailValidator.validate(formData);
      if (error) return validationError(error);

      const newUser = await db.user.update({
        where: { id: user.id },
        data,
      });

      return json(newUser);
    }
    case 'userInfo': {
      const { data, error } = await userInfoValidator.validate(formData);
      if (error) return validationError(error);

      const newUser = await db.user.update({
        where: { id: user.id },
        data,
      });

      return json(newUser);
    }
    case 'password': {
      const { data, error } = await passwordValidator.validate(formData);
      if (error) return validationError(error);

      const auth = await db.auth.findUnique({
        where: { username: user.username },
      });
      if (!auth)
        return validationError({
          fieldErrors: { current: 'Authentication failed' },
        });

      const passwordMatch = await bcryptjs.compare(
        data.current,
        auth.passwordHash,
      );
      if (!passwordMatch)
        return validationError({
          fieldErrors: { current: 'Incorrect password' },
        });

      const newHash = await bcryptjs.hash(data.new, 10);
      await db.auth.update({
        where: { username: user.username },
        data: { passwordHash: newHash },
      });

      return json({ success: true });
    }
  }
}

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  return json({ user });
}

export default function AccountRoute() {
  const { user } = useLoaderData<typeof loader>();

  let defaultImageUrl = user.avatarUrl ?? null;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <div className="responsive">
      <header
        className="
          border-b
          pt-6 pb-6 mb-4
        "
      >
        <h1 className="font-display text-4xl">My Account</h1>
      </header>

      <div className="flex flex-col sm:grid sm:grid-cols-[auto_1fr] sm:items-start gap-4">
        <div className="card bg-primary p-2 sm:w-64 sm:row-span-2">
          <div className="bg-surface p-4 rounded-lg flex flex-col mt-12">
            <div className="bg-surface rounded-full p-1 -mt-16 self-start">
              <Avatar src={user.avatarUrl} alt="user pic" size="xl" />
            </div>

            <div className="font-medium mt-2">{user.displayName}</div>
            <div className="text-sm text-light">@{user.username}</div>
          </div>
        </div>

        <div className="card sm:col-start-2">
          <div className="card-heading">
            <h2>Profile settings</h2>
          </div>

          <Form.Root
            validator={avatarValidator}
            subaction="avatar"
            method="post"
            encType="multipart/form-data"
          >
            <Form.Label htmlFor="avatar">Profile picture</Form.Label>
            <div className="max-w-[8rem] flex flex-col gap-2">
              <ImageUpload
                imageUrl={imageUrl}
                defaultImageUrl={defaultImageUrl}
                setImageUrl={setImageUrl}
                imageClassName="w-full object-cover aspect-square rounded-full"
              />
              <Form.SubmitButton className="-mt-2" />
            </div>
          </Form.Root>

          <Form.Root
            validator={userInfoValidator}
            subaction="userInfo"
            method="post"
            encType="multipart/form-data"
          >
            <Form.Label htmlFor="displayName">Display name</Form.Label>
            <div>
              <div className="flex flex-row gap-2">
                <Form.Input
                  name="displayName"
                  id="displayName"
                  defaultValue={user.displayName}
                  className="flex-1"
                />

                <Form.SubmitButton>Change</Form.SubmitButton>
              </div>
              <Form.Error name="displayName" id="displayName" />
            </div>
          </Form.Root>
        </div>

        <div className="card sm:col-start-2">
          <div className="card-heading">
            <h2>Account settings</h2>
          </div>

          <div className="flex flex-col gap-4">
            <Form.Root
              validator={emailValidator}
              subaction="email"
              method="post"
              encType="multipart/form-data"
            >
              <Form.Label htmlFor="email">Email</Form.Label>
              <div>
                <div className="flex flex-row gap-2">
                  <Form.Input
                    name="email"
                    id="email"
                    defaultValue={user.email}
                    className="flex-1"
                  />

                  <Form.SubmitButton>Change</Form.SubmitButton>
                </div>
                <Form.Error name="email" id="email" />
              </div>
            </Form.Root>

            <Dialog
              title="Change Password"
              trigger={<Button>Change password</Button>}
            >
              <Form.Root
                validator={passwordValidator}
                subaction="password"
                method="post"
                encType="multipart/form-data"
              >
                <Form.Field>
                  <Form.Label htmlFor="currentPassword">
                    Current password
                  </Form.Label>
                  <Form.Input
                    type="password"
                    name="current"
                    id="currentPassword"
                  />
                  <Form.Error name="current" id="currentPassword" />
                </Form.Field>

                <Form.Field>
                  <Form.Label htmlFor="newPassword">New password</Form.Label>
                  <Form.Input type="password" name="new" id="newPassword" />
                  <Form.Error name="new" id="newPassword" />
                </Form.Field>

                <Form.SubmitButton>Change password</Form.SubmitButton>
              </Form.Root>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
