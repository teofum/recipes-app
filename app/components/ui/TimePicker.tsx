import { useCallback, useEffect, useState } from 'react';
import Form from './Form';

const hours = Array.from(Array(24), (_, i) => i);
const minutes = Array.from(Array(60), (_, i) => i);

interface Time {
  hour: number;
  minute: number;
}

interface Props {
  onChange?: (time: Time) => void;
}

export default function TimePicker({ onChange }: Props) {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    onChange?.({ hour, minute });
  }, [hour, minute, onChange]);

  const scrollIntoView = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      (ev.target as HTMLButtonElement).scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
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
      "
    >
      <div
        className="w-10 h-20 overflow-y-auto snap-y snap-mandatory hide-scrollbars"
        onScroll={(ev) => onScroll(ev, 'h')}
      >
        <div className="w-full leading-6 font-semibold px-2 py-7">
          {hours.map((h) => (
            <button
              key={h}
              className="w-full text-right snap-center origin-center"
              onClick={scrollIntoView}
            >
              {h}
            </button>
          ))}
        </div>
      </div>
      <div>hours</div>

      <div
        className="w-10 h-20 overflow-y-auto snap-y snap-mandatory hide-scrollbars"
        onScroll={(ev) => onScroll(ev, 'm')}
      >
        <div className="w-full leading-6 font-semibold px-2 py-7">
          {minutes.map((m) => (
            <button
              key={m}
              className="w-full text-right snap-center origin-center"
              onClick={scrollIntoView}
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
          from-white to-[rgb(255_255_255_/_50%)] bg-gradient-to-b
        "
      />
      <div
        className="
          absolute bottom-0 left-0 w-full h-7 pointer-events-none
          from-white to-[rgb(255_255_255_/_50%)] bg-gradient-to-t
        "
      />
    </div>
  );
}

export function TimePickerFormInput(
  props: React.ComponentProps<typeof Form.Input>,
) {
  const [minutes, setMinutes] = useState('0');

  const onChange = useCallback(
    ({ hour, minute }: Time) => setMinutes((hour * 60 + minute).toString()),
    [],
  );

  return (
    <>
      <TimePicker onChange={onChange} />
      <Form.Input {...props} type="hidden" value={minutes} />
    </>
  );
}
