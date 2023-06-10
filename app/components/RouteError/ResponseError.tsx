import { LinkButton } from '../ui/Button';

const DEFAULT_ERROR = 'Looks like something went wrong on our end. Sorry!';

/**
 * Clone of Remix's ErrorResponse class which is not exposed for some reason
 */
export interface ErrorResponse<T> {
  status: number;
  statusText: string;
  data: T;
  error?: Error;
  internal: boolean;
}

export interface ResponseErrorProps {
  error: ErrorResponse<unknown>;
}

/**
 * Renders error boundary for an HTTP error response (4xx or 5xx).
 */
export default function ResponseError({ error }: ResponseErrorProps) {
  const message = (error.data as { message: string }).message ?? DEFAULT_ERROR;

  return (
    <div className="responsive py-8 min-h-full flex flex-col">
      <div className="card flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 grid place-content-center gap-4 text-center">
          <h1 className="font-display text-4xl pb-4 border-b">
            {error.status} {error.statusText}
          </h1>

          <p className="max-w-lg [text-wrap:balance] text-sm">
            {message}
          </p>

          <LinkButton to="." reloadDocument>
            Reload the page
          </LinkButton>

          {!!error.data && (
            <details
              className="
                max-w-lg w-full text-left bg-neutral-6
                border rounded-md
              "
            >
              <summary className="text-sm p-2">Technical details</summary>
              <pre className="p-2 overflow-x-auto text-xs">
                {JSON.stringify(error.data)}
              </pre>
            </details>
          )}

          {error.error && (
            <details
              className="
                max-w-lg w-full text-left bg-neutral-6
                border rounded-md
              "
            >
              <summary className="text-sm p-2">Technical details</summary>
              <pre className="p-2 overflow-x-auto text-xs">
                {error.error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
