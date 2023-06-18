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
import { useFormContext, validationError } from 'remix-validated-form';
import { z } from 'zod';

import Button from '~/components/ui/Button';
import Dialog from '~/components/ui/Dialog';
import Form from '~/components/ui/Form';
import { db } from '~/server/db.server';
import { requireUser } from '~/server/session.server';
import RouteError from '~/components/RouteError';
import { MAX_UPLOAD_SIZE } from '~/utils/constants';
import uploadImage, { deleteImage } from '~/server/image.server';
import AvatarUpload from './AvatarUpload';
import { useTranslation } from 'react-i18next';
import LanguageSelect from '~/components/ui/LanguageSelect';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'My Account | CookBook' }];
};

const emailValidator = withZod(
  z.object({
    email: z.string().email('account:profile.validation.email.invalid'),
  }),
);

const profileValidator = withZod(
  z.object({
    displayName: z
      .string()
      .min(3, 'account:profile.validation.display-name.too-short')
      .max(20, 'account:profile.validation.display-name.too-long'),
    image: z.instanceof(File).optional(),
  }),
);

const passwordValidator = withZod(
  z.object({
    current: z
      .string()
      .min(1, 'account:dialogs.change-password.validation.current.required'),
    new: z
      .string()
      .min(8, 'account:dialogs.change-password.validation.new.too-short'),
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
    case 'profile': {
      const { data, error } = await profileValidator.validate(formData);
      if (error) return validationError(error);

      if (data.image && data.image.name) {
        if (user.avatarUrl) await deleteImage(user.avatarUrl);

        const filename = `${user.id}.${Date.now()}.webp`;
        const imageUrl = await uploadImage(data.image, 'avatar', filename, {
          width: 256,
          height: 256,
        });

        await db.user.update({
          where: { id: user.id },
          data: { avatarUrl: imageUrl },
        });
      }

      const newUser = await db.user.update({
        where: { id: user.id },
        data: { displayName: data.displayName },
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
    case 'password': {
      const { data, error } = await passwordValidator.validate(formData);
      if (error) return validationError(error);

      const auth = await db.auth.findUnique({
        where: { username: user.username },
      });
      if (!auth)
        return validationError({
          fieldErrors: {
            current: 'account:dialogs.change-password.errors.auth-failed',
          },
        });

      const passwordMatch = await bcryptjs.compare(
        data.current,
        auth.passwordHash,
      );
      if (!passwordMatch)
        return validationError({
          fieldErrors: {
            current: 'account:dialogs.change-password.errors.password',
          },
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

export const handle = { i18n: 'account' };

export default function AccountRoute() {
  const { user } = useLoaderData<typeof loader>();
  const { touchedFields } = useFormContext('profileForm');

  const { t } = useTranslation();

  let defaultImageUrl = user.avatarUrl ?? null;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <div className="responsive">
      <header className=" border-b pt-6 pb-6 mb-4">
        <h1 className="font-display text-4xl">{t('account:title')}</h1>
      </header>

      <div className="flex flex-col sm:grid sm:grid-cols-[auto_1fr] sm:items-start gap-4">
        <div className="card bg-primary-4 p-2 sm:w-64 sm:row-span-2">
          <Form.Root
            validator={profileValidator}
            subaction="profile"
            method="post"
            encType="multipart/form-data"
            className="bg-surface p-4 rounded-lg flex flex-col mt-12"
            id="profileForm"
          >
            <div className="bg-surface rounded-full p-1 -mt-16 self-start">
              <AvatarUpload
                imageUrl={imageUrl}
                defaultImageUrl={defaultImageUrl}
                setImageUrl={setImageUrl}
                imageClassName="w-full object-cover aspect-square rounded-full"
              />
            </div>

            <Form.Field>
              <Form.Input
                name="displayName"
                id="displayName"
                defaultValue={user.displayName}
                className="-m-2 font-medium"
              />
              <Form.Error name="displayName" id="displayName" />
            </Form.Field>

            <div className="text-xs text-light">@{user.username}</div>

            <Form.SubmitButton
              disabled={!touchedFields.displayName && !touchedFields.image}
            >
              {t('account:profile.actions.save')}
            </Form.SubmitButton>
          </Form.Root>
        </div>

        <div className="card sm:col-start-2">
          <div className="card-heading">
            <h2>{t('account:settings.title')}</h2>
          </div>

          <div className="flex flex-col gap-4">
            <Form.Root
              validator={emailValidator}
              subaction="email"
              method="post"
              encType="multipart/form-data"
            >
              <Form.Label htmlFor="email">
                {t('account:settings.fields.email.label')}
              </Form.Label>
              <div>
                <div className="flex flex-row gap-2">
                  <Form.Input
                    name="email"
                    id="email"
                    defaultValue={user.email}
                    className="flex-1"
                  />

                  <Form.SubmitButton>
                    {t('account:settings.fields.email.action')}
                  </Form.SubmitButton>
                </div>
                <Form.Error name="email" id="email" />
              </div>
            </Form.Root>

            <Dialog
              title={t('account:dialogs.change-password.title')}
              trigger={
                <Button>{t('account:settings.actions.change-password')}</Button>
              }
            >
              <Form.Root
                validator={passwordValidator}
                subaction="password"
                method="post"
                encType="multipart/form-data"
              >
                <Form.Field>
                  <Form.Label htmlFor="currentPassword">
                    {t('account:dialogs.change-password.fields.current.label')}
                  </Form.Label>
                  <Form.Input
                    type="password"
                    name="current"
                    id="currentPassword"
                  />
                  <Form.Error name="current" id="currentPassword" />
                </Form.Field>

                <Form.Field>
                  <Form.Label htmlFor="newPassword">
                    {t('account:dialogs.change-password.fields.new.label')}
                  </Form.Label>
                  <Form.Input type="password" name="new" id="newPassword" />
                  <Form.Error name="new" id="newPassword" />
                </Form.Field>

                <Form.SubmitButton>
                  {t('account:dialogs.change-password.actions.change')}
                </Form.SubmitButton>
              </Form.Root>
            </Dialog>
          </div>
        </div>

        <div className="card sm:col-start-2">
          <div className="card-heading">
            <h2>{t('account:app-settings.title')}</h2>
          </div>

          <LanguageSelect />
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return <RouteError error={error} />;
}
