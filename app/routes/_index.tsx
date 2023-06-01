import type { V2_MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Recipes App' }];
};

export const loader = () => {
  return redirect('/recipes');
};

export default function IndexRoute() {
  return <div className="p-6">nothing to see here</div>;
}
