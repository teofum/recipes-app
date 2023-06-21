import { Visibility } from '@prisma/client';
import {
  EyeNoneIcon,
  EyeOpenIcon,
  LockClosedIcon,
} from '@radix-ui/react-icons';

export const visibility = [
  {
    value: Visibility.PUBLIC,
    name: 'visibility.public.name',
    description: 'visibility.public.description',
    icon: EyeOpenIcon,
  },
  {
    value: Visibility.UNLISTED,
    name: 'visibility.unlisted.name',
    description: 'visibility.unlisted.description',
    icon: EyeNoneIcon,
  },
  {
    value: Visibility.PRIVATE,
    name: 'visibility.private.name',
    description: 'visibility.private.description',
    icon: LockClosedIcon,
  },
];
