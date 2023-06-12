import { PersonIcon } from '@radix-ui/react-icons';
import cn from 'classnames';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar({
  src,
  alt,
  size = 'md',
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        'border-2 border-primary rounded-full p-[2px]',
        {
          'w-8 h-8': size === 'sm',
          'w-10 h-10': size === 'md',
          'w-16 h-16': size === 'lg',
          'w-32 h-32': size === 'xl',
        },
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <div
          className="
            w-full h-full rounded-full bg-neutral-1
            flex items-center justify-center
          "
        >
          <PersonIcon
            className={cn('text-white', {
              'w-5 h-5': size === 'md',
              'w-7 h-7': size === 'lg',
              'w-16 h-16': size === 'xl',
            })}
          />
        </div>
      )}
    </div>
  );
}
