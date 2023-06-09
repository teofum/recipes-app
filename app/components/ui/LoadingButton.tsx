import cn from 'classnames';

import Button from './Button';
import Loading from './Loading';

type LoadingButtonProps = {
  loading?: boolean;
} & React.ComponentProps<typeof Button>;

export default function LoadingButton({
  loading = false,
  className,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      data-loading={loading}
      disabled={disabled || loading}
      className={cn('relative', className)}
      {...props}
    >
      {loading && (
        <div
          className="
            absolute top-0 left-0 w-full h-full bg-inherit rounded-md
            flex items-center justify-center pointer-events-none
          "
        >
          <Loading />
        </div>
      )}
      <div className="flex flex-row justify-center items-center">
        {children}
      </div>
    </Button>
  );
}
