import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { db } from '~/server/db.server';

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search');
  const take = Number(url.searchParams.get('take') ?? 5);

  if (!search) return [];

  const ingredients = await db.ingredient.findMany({
    where: { name: { contains: search } },
    take,
  });

  return json([...ingredients]);
}
