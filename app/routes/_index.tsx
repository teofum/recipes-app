import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function IndexRoute() {
  return (
    <div>
      <h1>Welcome to Remix</h1>
    </div>
  );
}
