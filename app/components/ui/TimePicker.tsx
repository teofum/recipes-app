import { useCallback, useEffect, useRef, useState } from 'react';
import Form from './Form';
import cn from 'classnames';

const hours = Array.from(Array(24), (_, i) => i);
const minutes = Array.from(Array(60), (_, i) => i);

interface Time {
  hour: number;
  minute: number;
}

interface Props {
  onChange?: (time: Time) => void;
  defaultHour?: number;
  defaultMinute?: number;
}

export default function TimePicker({
  onChange,
  defaultHour,
  defaultMinute,
}: Props) {
  const [hour, setHour] = useState(defaultHour ?? 0);
  const [minute, setMinute] = useState(defaultMinute ?? 0);

  const hoursElement = useRef<HTMLDivElement>(null);
  const minutesElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChange?.({ hour, minute });
  }, [hour, minute, onChange]);

  useEffect(() => {
    hoursElement.current?.scrollTo({ top: (defaultHour ?? 0) * 24 });
    minutesElement.current?.scrollTo({ top: (defaultMinute ?? 0) * 24 });
  }, [defaultHour, defaultMinute]);

  const scrollIntoView = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
      ev.preventDefault();
      ev.stopPropagation();

      const scroller = (ev.target as HTMLElement).parentElement?.parentElement;
      scroller?.scrollTo({ top: index * 24, behavior: 'smooth' });
    },
    [],
  );

  const onScroll = useCallback(
    (ev: React.UIEvent<HTMLDivElement, UIEvent>, type: 'h' | 'm') => {
      const target = ev.target as HTMLDivElement;
      const scroll = target.scrollTop;

      // Scroll will always snap to a multiple of 24px, so if it isn't
      // we can throw away the event without checking anything else
      if (scroll % 24 !== 0) return;

      const index = scroll / 24;
      switch (type) {
        case 'h':
          setHour(index);
          break;
        case 'm':
          setMinute(index);
          break;
      }
    },
    [],
  );

  return (
    <div
      className="
        flex flex-row items-center gap-1 relative
        bg-white rounded-md overflow-hidden
        border
      "
    >
      <div
        className="
          w-10 h-20 overflow-y-auto snap-y snap-mandatory hide-scrollbars
          group outline-none
        "
        onScroll={(ev) => onScroll(ev, 'h')}
        ref={hoursElement}
        tabIndex={0}
      >
        <div className="w-full leading-6 font-semibold py-7">
          {hours.map((h) => (
            <button
              key={h}
              className={cn(
                `
                w-full text-right snap-center origin-center px-2 rounded-md
                outline outline-2 outline-transparent
                -outline-offset-2 transition-[outline]
                `,
                {
                  'group-focus-visible:outline-primary': h === hour,
                },
              )}
              tabIndex={-1}
              onClick={(ev) => scrollIntoView(ev, h)}
            >
              {h}
            </button>
          ))}
        </div>
      </div>
      <div>hours</div>

      <div
        className="
          w-10 h-20 overflow-y-auto snap-y snap-mandatory hide-scrollbars
          group outline-none
        "
        onScroll={(ev) => onScroll(ev, 'm')}
        ref={minutesElement}
        tabIndex={0}
      >
        <div className="w-full leading-6 font-semibold py-7">
          {minutes.map((m) => (
            <button
              key={m}
              className={cn(
                `
                w-full text-right snap-center origin-center px-2 rounded-md
                outline outline-2 outline-transparent
                -outline-offset-2 transition-[outline]
                `,
                {
                  'group-focus-visible:outline-primary': m === minute,
                },
              )}
              tabIndex={-1}
              onClick={(ev) => scrollIntoView(ev, m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div>minutes</div>

      <div
        className="
          absolute top-0 left-0 w-full h-7 pointer-events-none
          from-white to-transparent bg-gradient-to-b
        "
      />
      <div
        className="
          absolute bottom-0 left-0 w-full h-7 pointer-events-none
          from-white to-transparent bg-gradient-to-t
        "
      />
    </div>
  );
}

export function TimePickerFormInput({
  defaultValue,
  ...props
}: React.ComponentProps<typeof Form.Input>) {
  const [minutes, setMinutes] = useState(defaultValue?.toString() ?? '0');

  const onChange = useCallback(
    ({ hour, minute }: Time) => setMinutes((hour * 60 + minute).toString()),
    [],
  );

  const defaultHour =
    typeof defaultValue === 'number' ? Math.floor(defaultValue / 60) : 0;
  const defaultMinute =
    typeof defaultValue === 'number' ? defaultValue % 60 : 0;

  return (
    <>
      <TimePicker
        onChange={onChange}
        defaultHour={defaultHour}
        defaultMinute={defaultMinute}
      />
      <Form.Input {...props} type="hidden" value={minutes} />
    </>
  );
}
