import { Unit } from "@prisma/client";

export const units = [
  {
    type: Unit.GRAMS,
    fullName: 'Grams',
    shortName: 'g',
  },
  {
    type: Unit.LITERS,
    fullName: 'Liters',
    shortName: 'L',
  },
  {
    type: Unit.UNITS,
    fullName: 'Units',
    shortName: 'u',
  }
];