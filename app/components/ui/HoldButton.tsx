import React, { useState } from 'react';

import Button from './Button';
import cn from 'classnames';
import LoadingButton from './LoadingButton';
import Form from './Form';
import { useFormContext } from 'remix-validated-form';

function useHoldButton(onLongPress?: () => void) {
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout | null>(null);
  const [completed, setCompleted] = useState(false);

  const start = (ev: React.PointerEvent<HTMLButtonElement>) => {
    if ((ev.target as HTMLButtonElement).disabled) return;

    setCompleted(false);

    setTimeoutRef(
      setTimeout(() => {
        onLongPress?.();
        setCompleted(true);
        setTimeoutRef(null);
      }, 1500),
    );
  };

  const cancel = (ev: React.PointerEvent<HTMLButtonElement>) => {
    if ((ev.target as HTMLButtonElement).disabled) return;

    if (timeoutRef === null) return;
    clearTimeout(timeoutRef);
    setTimeoutRef(null);
  };

  const classNames = cn(
    `
      absolute inset-0 pointer-events-none z-10
      bg-[var(--btn-text)] opacity-20 origin-left scale-x-0
      transition duration-300 ease-out
    `,
    {
      'scale-x-100 duration-[1500ms] ease-in': timeoutRef !== null,
      'origin-right duration-100': completed,
    },
  );

  return { start, cancel, classNames };
}

type HoldButtonProps = {
  onLongPress?: () => void;
} & React.ComponentProps<typeof Button>;

const HoldButton = React.forwardRef<HTMLButtonElement, HoldButtonProps>(
  function HoldButtonComponent(
    { children, className, onLongPress, ...props },
    ref,
  ) {
    const { start, cancel, classNames } = useHoldButton(onLongPress);

    return (
      <Button
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        {...props}
      >
        <div className={classNames} />

        {children}
      </Button>
    );
  },
);

export default HoldButton;

type HoldLoadingButtonProps = {
  onLongPress?: () => void;
} & React.ComponentProps<typeof LoadingButton>;

export const HoldLoadingButton = React.forwardRef<
  HTMLButtonElement,
  HoldLoadingButtonProps
>(function HoldButtonComponent(
  { children, className, onLongPress, ...props },
  ref,
) {
  const { start, cancel, classNames } = useHoldButton(onLongPress);

  return (
    <LoadingButton
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      {...props}
    >
      <div className={classNames} />

      {children}
    </LoadingButton>
  );
});

type HoldSubmitButtonProps = React.ComponentProps<typeof Form.SubmitButton>;

export const HoldSubmitButton = React.forwardRef<
  HTMLButtonElement,
  HoldSubmitButtonProps
>(function HoldButtonComponent(
  { children, className, ...props },
  ref,
) {
  const { submit } = useFormContext();
  const { start, cancel, classNames } = useHoldButton(submit);

  return (
    <Form.SubmitButton
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onClick={(ev) => ev.preventDefault()}
      {...props}
    >
      <div className={classNames} />

      {children}
    </Form.SubmitButton>
  );
});
