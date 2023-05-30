import type { User as PrismaUser } from '@prisma/client';
import type { Serialize } from '~/utils/Serialize.type';

export type User = Serialize<PrismaUser>;
