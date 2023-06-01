import cn from 'classnames';

const dots = [1, 2, 3, 4];

type LoadingProps = {
  size?: 'sm' | 'md' | 'lg';
} & React.ComponentProps<'div'>;

export default function Loading({
  size = 'md',
  className,
  ...props
}: LoadingProps) {
  return (
    <div
      className={cn('flex flex-row gap-1 items-center', className, {
        'h-4': size === 'sm',
        'h-6': size === 'md',
        'h-8': size === 'lg',
      })}
      {...props}
    >
      {dots.map((i) => (
        <div
          key={i}
          className={cn('bg-current rounded-full animate-wave', {
            'w-1 h-1': size === 'sm',
            'w-1.5 h-1.5': size === 'md',
            'w-2 h-2': size === 'lg',
          })}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}
