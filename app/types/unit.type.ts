import { Unit } from '@prisma/client';
import formatNumberWithSIPrefix from '~/utils/formatNumberWithSIPrefix';

export const units = [
  {
    type: Unit.UNITS,
    fullName: 'Units',
    shortName: 'u',
    format: (amt: number) => `x${amt}`,
  },
  {
    type: Unit.GRAMS,
    fullName: 'Grams',
    shortName: 'g',
    format: (amt: number) => `${formatNumberWithSIPrefix(amt)}g`,
  },
  {
    type: Unit.LITERS,
    fullName: 'Liters',
    shortName: 'L',
    format: (amt: number) => `${formatNumberWithSIPrefix(amt)}L`,
  },
];
