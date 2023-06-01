import type { V2_MetaFunction } from "@remix-run/node";
import TimePicker from "~/components/ui/TimePicker";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function IndexRoute() {
  return (
    <div className="p-6">
      <TimePicker />
    </div>
  );
}
