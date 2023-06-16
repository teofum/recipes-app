import { TimerIcon } from '@radix-ui/react-icons';
import cn from 'classnames';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

function formatTime(totalMinutes: number, t: TFunction): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  return `${hours > 0 ? t('format.hours', { count: hours }) : ''} ${t(
    'format.minutes',
    { count: minutes },
  )}`;
}

function formatTimeShort(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  return (hours > 0 ? `${hours} h, ` : '') + `${minutes} min`;
}

interface TimeBadgeProps {
  minutes: number;
  format?: 'long' | 'short' | 'responsive';
}

export default function TimeBadge({
  minutes,
  format = 'responsive',
}: TimeBadgeProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-center gap-2 py-1 px-2 border rounded-full">
      <TimerIcon className="text-primary" />
      <span
        className={cn('text-sm', {
          hidden: format === 'short',
          'hidden sm:inline': format === 'responsive',
        })}
      >
        {formatTime(minutes, t)}
      </span>
      <span
        className={cn('text-sm', {
          hidden: format === 'long',
          'sm:hidden': format === 'responsive',
        })}
      >
        {formatTimeShort(minutes)}
      </span>
    </div>
  );
}
