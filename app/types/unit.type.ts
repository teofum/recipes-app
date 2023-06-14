import { Unit } from '@prisma/client';
import formatNumberWithSIPrefix from '~/utils/formatNumberWithSIPrefix';

export const units = [
  {
    type: Unit.UNITS,
    fullName: 'units.units',
    shortName: 'u',
    format: (amt: number) => `x${amt}`,
  },
  {
    type: Unit.GRAMS,
    fullName: 'units.grams',
    shortName: 'g',
    format: (amt: number) => `${formatNumberWithSIPrefix(amt)}g`,
  },
  {
    type: Unit.LITERS,
    fullName: 'units.liters',
    shortName: 'L',
    format: (amt: number) => `${formatNumberWithSIPrefix(amt)}L`,
  },
];
