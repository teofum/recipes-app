import cn from 'classnames';
import type { ElementProps } from '~/utils/ElementProps.type';
import {
  ValidatedForm,
  useField,
  useIsSubmitting,
  useIsValid,
} from 'remix-validated-form';
import LoadingButton from './LoadingButton';

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
  return <div className={cn('flex flex-col gap-1', className)} {...props} />;
}

function Label({ className, ...props }: ElementProps<'label'>) {
  return <label className={cn('text-sm', className)} {...props} />;
}

type InputProps = {
  name: string;
  id: string;
} & ElementProps<'input'>;

function Input({ id, name, type, className, ...props }: InputProps) {
  const { error, getInputProps } = useField(name);

  return (
    <>
      <input
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
          `,
          className,
        )}
        aria-invalid={error ? true : undefined}
        aria-errormessage={error ? `${id}__error` : undefined}
        {...getInputProps({ type, id })}
        {...props}
      />
    </>
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
  Error,
  SubmitButton,
};
