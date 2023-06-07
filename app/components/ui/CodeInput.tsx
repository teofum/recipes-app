import { useField } from 'remix-validated-form';
import VerificationInput from 'react-verification-input';

interface CodeInputProps {
  name: string;
  id: string;
  className?: string;
}

export default function CodeInput({ name, id, className }: CodeInputProps) {
  const { error, getInputProps } = useField(name);
  const { onChange } = getInputProps();

  return (
    <VerificationInput
      inputProps={{
        name,
        id,
        autoComplete: 'off',
        'aria-invalid': error ? true : undefined,
      }}
      containerProps={{ 'aria-invalid': error ? true : undefined }}
      onChange={onChange}
      classNames={{
        container: 'flex flex-row justify-center gap-1 w-min h-auto group',
        character: `
          w-10 h-auto leading-10 text-2xl font-medium bg-stone-50
          border border-black border-opacity-10
          rounded-md
          group-aria-[invalid]:border-red-500 group-aria-[invalid]:bg-red-50
          transition
        `,
        characterSelected:
          '!border-green-500 !bg-green-50 text-green-500 outline-none',
      }}
    />
  );
}
