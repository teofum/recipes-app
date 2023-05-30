import cn from 'classnames';
import type { ElementProps } from '~/utils/ElementProps.type';
import {
  ValidatedForm,
  useField,
  useIsSubmitting,
  useIsValid,
} from 'remix-validated-form';
import LoadingButton from './LoadingButton';
import S from './Select';
import { useState } from 'react';

function Root({
  validator,
  className,
  ...props
}: React.ComponentProps<typeof ValidatedForm>) {
  return (
    <ValidatedForm
      validator={validator}
      className={cn('flex flex-col gap-3', className)}
      {...props}
    />
  );
}

function Field({ className, ...props }: ElementProps<'div'>) {
  return <div className={className ?? 'flex flex-col gap-1'} {...props} />;
}

function Label({ className, ...props }: ElementProps<'label'>) {
  return <label className={className ?? 'text-sm'} {...props} />;
}

type InputProps = {
  name: string;
  id: string;
} & ElementProps<'input'>;

function Input({ id, name, type, className, ...props }: InputProps) {
  const { error, getInputProps } = useField(name);

  return (
    <input
      className={cn(
        `
          text-sm
          bg-stone-50
          border border-black border-opacity-20
          rounded-md
          px-2 py-1.5
          outline-none outline-offset-0
          focus-visible:border-green-500 focus-visible:bg-green-50
          aria-[invalid]:border-red-500 aria-[invalid]:bg-red-50
          transition
          `,
        className,
      )}
      aria-invalid={error ? true : undefined}
      aria-errormessage={error ? `${id}__error` : undefined}
      {...getInputProps({ type, id })}
      {...props}
    />
  );
}

type TextareaProps = {
  name: string;
  id: string;
  containerClassName?: string;
} & ElementProps<'textarea'>;

function Textarea({
  id,
  name,
  className,
  containerClassName,
  maxLength,
  ...props
}: TextareaProps) {
  const { error, getInputProps } = useField(name);

  const [length, setLength] = useState(0);

  return (
    <div
      className={cn(
        `
        grid
        after:content-[attr(data-replicated-value)]
        after:text-sm after:p-2 after:border after:[grid-area:1/1/2/2]
        after:whitespace-pre-wrap after:[visibility:hidden]
        `,
        containerClassName,
      )}
      data-replicated-value={props.value ?? props.defaultValue ?? ''}
    >
      <textarea
        className={cn(
          `
          text-sm
          bg-stone-50
          border border-black border-opacity-20
          rounded-md
          p-2
          outline-none outline-offset-0
          focus-visible:border-green-500 focus-visible:bg-green-50
          aria-[invalid]:border-red-500 aria-[invalid]:bg-red-50
          transition
          [grid-area:1/1/3/2] resize-none overflow-hidden
          `,
          className,
        )}
        aria-invalid={error ? true : undefined}
        aria-errormessage={error ? `${id}__error` : undefined}
        maxLength={maxLength}
        {...getInputProps({ id })}
        {...props}
        onInput={(ev) => {
          const ta = ev.target as HTMLTextAreaElement;
          if (ta.parentElement)
            ta.parentElement.dataset.replicatedValue = ta.value;

          setLength(ta.value.length);
        }}
      />

      {maxLength !== undefined && (
        <span
          className="
            [grid-area:2/1/3/2] place-self-end
            text-xs text-stone-500
            px-2 pb-1 -mt-1
          "
        >
          {length}/{maxLength}
        </span>
      )}
    </div>
  );
}

type SelectProps = { name: string } & React.ComponentProps<typeof S.Root>;

function Select({ name, children, ...props }: SelectProps) {
  const { error, getInputProps } = useField(name);
  const { onChange, onBlur, ...inputProps } = getInputProps();

  return (
    <S.Root
      aria-invalid={error ? true : undefined}
      onValueChange={(value) => {
        console.log('change', name, value, onBlur);
        onChange?.(); // Triggers validation?
        props.onValueChange?.(value);
      }}
      {...inputProps}
      {...props}
    >
      {children}
    </S.Root>
  );
}

type ErrorProps = {
  name: string;
  id: string;
};

function Error({ name, id }: ErrorProps) {
  const { error } = useField(name);

  return (
    <p id={`${id}__error`} className="text-sm text-red-500">
      {error || ' '}
    </p>
  );
}

function SubmitButton({
  children = 'Submit',
  className,
  ...props
}: React.ComponentProps<typeof LoadingButton>) {
  const isValid = useIsValid();
  const isSubmitting = useIsSubmitting();

  return (
    <LoadingButton
      type="submit"
      disabled={!isValid}
      loading={isSubmitting}
      className={cn('mt-4', className)}
      {...props}
    >
      {children}
    </LoadingButton>
  );
}

export default {
  Root,
  Field,
  Label,
  Input,
  Textarea,
  Select,
  Error,
  SubmitButton,
};
