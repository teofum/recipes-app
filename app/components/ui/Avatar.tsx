import { PersonIcon } from '@radix-ui/react-icons';
import cn from 'classnames';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Avatar({ src, alt, size = 'md' }: AvatarProps) {
  return (
    <div
      className={cn('border-2 border-green-400 rounded-full p-[2px]', {
        'w-8 h-8': size === 'sm',
        'w-10 h-10': size === 'md',
        'w-16 h-16': size === 'lg',
        'w-24 h-24': size === 'xl',
      })}
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
            w-full h-full rounded-full bg-stone-400
            flex items-center justify-center
          "
        >
          <PersonIcon className={cn('text-stone-50', {
            'w-5 h-5': size === 'md',
            'w-8 h-8': size === 'lg',
            'w-12 h-12': size === 'xl',
          })} />
        </div>
      )}
    </div>
  );
}
