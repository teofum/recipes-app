import { useMatches } from '@remix-run/react';
import { LinkButton } from '../ui/Button';

const DEFAULT_ERROR = 'Unknown error';

interface UnexpectedErrorProps {
  error: Error;
}

/**
 * Renders error boundary for a thrown error.
 */
export default function UnexpectedError({ error }: UnexpectedErrorProps) {
  const matches = useMatches();
  const currentPath = matches.at(-1)?.pathname ?? 'N/A';

  const message = error.message || DEFAULT_ERROR;

  return (
    <div className="responsive py-8 min-h-full flex flex-col">
      <div className="card border-2 border-red-600 flex-1 flex flex-col overflow-hidden">
        <div className="-mt-6 -mx-6 bg-red-600 text-white text-opacity-5 p-3 bg-stripes">
          <pre className="text-white text-xs">
            Unexpected error in route {currentPath}
          </pre>
        </div>

        <div className="flex-1 grid place-content-center gap-4 text-center">
          <h1 className="font-display text-4xl pb-4 border-b border-black border-opacity-10">
            Something went wrong
          </h1>

          <p className="max-w-lg [text-wrap:balance] text-sm">
            Looks like something went wrong on our end: {message}. Sorry!
          </p>

          <LinkButton to="." reloadDocument>
            Reload the page
          </LinkButton>

          <details
            className="
              max-w-lg w-full text-left bg-stone-50
              border border-black border-opacity-10 rounded-md
            "
          >
            <summary className="text-sm p-2">Technical details</summary>
            <pre className="p-2 overflow-x-auto text-xs">{error.stack}</pre>
          </details>
        </div>
      </div>
    </div>
  );
}
