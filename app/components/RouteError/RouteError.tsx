import { isRouteErrorResponse } from '@remix-run/react';
import ResponseError from './ResponseError';
import UnexpectedError from './UnexpectedError';
import UnknownError from './UnknownError';

interface RouteErrorProps {
  error: unknown;
}

export default function RouteError({ error }: RouteErrorProps) {
  if (isRouteErrorResponse(error)) {
    return <ResponseError error={error} />;
  } else if (error instanceof Error) {
    return <UnexpectedError error={error} />;
  } else {
    return <UnknownError error={error} />;
  }
}
