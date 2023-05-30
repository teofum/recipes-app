import type { Ingredient as PrismaIngredient } from '@prisma/client';
import type { Serialize } from '~/utils/Serialize.type';

export type Ingredient = Serialize<PrismaIngredient>;
