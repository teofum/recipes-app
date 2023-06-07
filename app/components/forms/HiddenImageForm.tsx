import React from 'react';
import type { useFetcher } from '@remix-run/react';

import type { ImageUploadAction } from '~/routes/resources.image';
import { imageUploadFormValidator } from '~/routes/resources.image';
import Form from '../ui/Form';

interface HiddenImageFormProps {
  fetcher: ReturnType<typeof useFetcher<ImageUploadAction>>;
}

const HiddenImageForm = React.forwardRef<
  HTMLInputElement,
  HiddenImageFormProps
>(function HiddenImageFormComponent({ fetcher }, ref) {
  return (
    <Form.Root
      method="post"
      encType="multipart/form-data"
      action="/resources/image"
      validator={imageUploadFormValidator}
      resetAfterSubmit
      fetcher={fetcher}
      className="hidden"
      id="__hidden_img_upload_form"
    >
      <Form.Input
        type="file"
        name="file"
        id="image"
        ref={ref}
        onChange={(ev) => {
          const target = ev.target as HTMLInputElement;
          (target.nextSibling as HTMLButtonElement).click();
        }}
      />
      <Form.SubmitButton />
    </Form.Root>
  );
});

export default HiddenImageForm;
