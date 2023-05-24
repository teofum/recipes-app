import cn from 'classnames';

import Button from './Button';
import Loading from './Loading';

type LoadingButtonProps = {
  loading?: boolean;
} & React.ComponentProps<typeof Button>;

export default function LoadingButton({
  loading = false,
  className,
  contentClassName,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      data-loading={loading}
      disabled={disabled || loading}
      className={cn(
        'data-[loading="true"]:text-black data-[loading="true"]:cursor-wait',
        className,
      )}
      contentClassName={cn(
        'relative group-data-[loading="true"]:bg-green-300',
        contentClassName,
      )}
      {...props}
    >
      {loading && (
        <div
          className="
            absolute top-0 left-0 w-full h-full bg-inherit rounded-md
            flex items-center justify-center
          "
        >
          <Loading />
        </div>
      )}
      {children}
    </Button>
  );
}
