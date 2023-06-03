import { useMatches } from '@remix-run/react';
import { LinkButton } from '../ui/Button';

/**
 * Renders error boundary for an unknown error
 * (something is thrown that's not an error object).
 */
export default function UnknownError({ error }: { error: unknown }) {
  const matches = useMatches();
  const currentPath = matches.at(-1)?.pathname ?? 'N/A';

  return (
    <div className="responsive py-8 min-h-full flex flex-col">
      <div className="card border-2 border-red-600 flex-1 flex flex-col overflow-hidden">
        <div className="-mt-6 -mx-6 bg-red-600 text-white text-opacity-5 p-3 bg-stripes">
          <pre className="text-white text-xs">
            Unknown application error in route {currentPath}
          </pre>
        </div>

        <div className="flex-1 grid place-content-center gap-4 text-center">
          <h1 className="font-display text-4xl pb-4 border-b border-black border-opacity-10">
            Something went <span className="italic">very</span> wrong
          </h1>

          <p className="max-w-lg [text-wrap:balance] text-sm">
            Oops! This wasn't supposed to happen. If you're seeing this screen,
            there's probably a bug in the app, and you should let the developer
            know.
          </p>

          <p className="max-w-lg [text-wrap:balance] text-sm">
            Some useful information to include: the full current URL,
            screenshot, and a description of what you were doing when you saw
            this screen.
          </p>

          <div>
            <LinkButton to="https://github.com/teofum/recipes-app/issues/new">
              File an issue on GitHub
            </LinkButton>

            <LinkButton to="mailto:teo.fum@outlook.com">
              Email the developer (please be polite)
            </LinkButton>
          </div>

          <details
            className="
              max-w-lg w-full text-left bg-stone-50
              border border-black border-opacity-10 rounded-md
            "
          >
            <summary className="text-sm p-2">Technical details</summary>
            <pre className="p-2 overflow-x-auto text-xs">
              {JSON.stringify(error)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
