import Form from '~/components/ui/Form';

export default function NameInput() {
  return (
    <Form.Field>
      <Form.Input
        name="name"
        id="name"
        placeholder="New recipe"
        className="
                font-display text-4xl md:text-5xl lg:text-6xl
                min-w-0 w-full
                p-0 bg-transparent border-none text-white
                focus-visible:bg-transparent
                placeholder:text-white placeholder:text-opacity-50
              "
      />
    </Form.Field>
  );
}
