import { Visibility } from '@prisma/client';
import {
  EyeNoneIcon,
  EyeOpenIcon,
  LockClosedIcon,
} from '@radix-ui/react-icons';

export const visibility = [
  // {
  //   value: Visibility.PUBLIC,
  //   name: 'Public',
  //   description:
  //     '(NOT IMPLEMENTED) The recipe may be shown to other users. Only you can edit.',
  //   icon: EyeOpenIcon,
  // },
  {
    value: Visibility.UNLISTED,
    name: 'Unlisted',
    description:
      'Anyone with the link can view. Will not be shown to other users. Only you can edit.',
    icon: EyeNoneIcon,
  },
  {
    value: Visibility.PRIVATE,
    name: 'Private',
    description: 'Only you can view and edit this recipe.',
    icon: LockClosedIcon,
  },
];
