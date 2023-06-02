import bcryptjs from 'bcryptjs';

import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { validationError } from 'remix-validated-form';
import { z } from 'zod';
import Avatar from '~/components/ui/Avatar';
import Button from '~/components/ui/Button';
import Dialog from '~/components/ui/Dialog';
import Form from '~/components/ui/Form';
import { db } from '~/server/db.server';
import { requireUser } from '~/server/session.server';

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

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  return json({ user });
}

export async function action({ request }: ActionArgs) {
  const user = await requireUser(request);

  const formData = await request.formData();
  const subaction = formData.get('subaction') as string;

  switch (subaction) {
    case 'userInfo': {
      const { data, error } = await userInfoValidator.validate(formData);
      if (error) throw validationError(error);

      const newUser = await db.user.update({
        where: { id: user.id },
        data,
      });

      return json(newUser);
    }
    case 'password': {
      const { data, error } = await passwordValidator.validate(formData);
      if (error) throw validationError(error);

      const auth = await db.auth.findUnique({
        where: { username: user.username },
      });
      if (!auth)
        throw validationError({
          fieldErrors: { current: 'Authentication failed' },
        });

      const passwordMatch = await bcryptjs.compare(
        data.current,
        auth.passwordHash,
      );
      if (!passwordMatch)
        throw validationError({
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

export default function AccountRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="responsive">
      <header
        className="
          border-b border-black border-opacity-10
          pt-6 pb-6 mb-4
        "
      >
        <h1 className="font-display text-4xl">My Account</h1>
      </header>

      <div className="card">
        <h2 className="card-heading">Account Information</h2>

        <div className="flex flex-row gap-4">
          <div>
            <Avatar alt="user pic" size="xl" />
          </div>

          <div className="flex flex-col gap-4">
            <Form.Root
              validator={userInfoValidator}
              subaction="userInfo"
              method="post"
              className="grid grid-cols-[auto_1fr] max-w-lg gap-2 content-start items-baseline text-sm"
            >
              <div className="font-semibold text-right">Username</div>
              <div className="leading-8">{user.username}</div>

              <div className="font-semibold text-right">Email</div>
              <div className="leading-8">{user.email}</div>

              <Form.Label
                htmlFor="displayName"
                className="font-semibold text-right"
              >
                Display name
              </Form.Label>
              <div>
                <div className="flex flex-row gap-2">
                  <Form.Input
                    name="displayName"
                    id="displayName"
                    defaultValue={user.displayName}
                  />

                  <Form.SubmitButton>Change</Form.SubmitButton>
                </div>
                <Form.Error name="displayName" id="displayName" />
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
