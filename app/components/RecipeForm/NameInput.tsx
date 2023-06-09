import Form from '~/components/ui/Form';
import { NAME_MAX_LENGTH } from './constants';

export default function NameInput() {
  return (
    <Form.Field>
      <Form.Error name="name" id="name" />
      <Form.Input
        name="name"
        id="name"
        placeholder="New recipe"
        maxLength={NAME_MAX_LENGTH}
        autoFocus
        className="
          font-display text-4xl md:text-5xl lg:text-6xl
          min-w-0 w-full
          p-0 bg-transparent !border-none text-white
          focus-visible:bg-transparent
          placeholder:text-white placeholder:text-opacity-50
          aria-[invalid]:bg-red-500 aria-[invalid]:bg-opacity-30
        "
      />
    </Form.Field>
  );
}
