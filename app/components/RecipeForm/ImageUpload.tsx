import type { FetcherWithComponents } from '@remix-run/react';
import type { ValidationErrorResponseData } from 'remix-validated-form';
import { useFormContext } from 'remix-validated-form';

import Form from '~/components/ui/Form';
import LoadingButton from '~/components/ui/LoadingButton';
import Loading from '~/components/ui/Loading';
import { PLACEHOLDER_IMAGE_URL } from '~/utils/constants';

function isErrorResponse(data: unknown): data is ValidationErrorResponseData {
  return (data as ValidationErrorResponseData).fieldErrors !== undefined;
}

interface ImageUploadProps {
  fetcher: FetcherWithComponents<unknown>;
  imageUrl?: string;
  openFile?: () => void;
}

export default function ImageUpload({
  fetcher,
  imageUrl,
  openFile,
}: ImageUploadProps) {
  const { clearAllErrors } = useFormContext('__hidden_img_upload_form');

  return (
    <div
      className="
        card flex flex-col gap-4
        sm:w-full sm:col-start-2 sm:row-span-2
      "
    >
      {fetcher.state === 'idle' ? (
        <img
          src={imageUrl || PLACEHOLDER_IMAGE_URL}
          alt=" "
          className="aspect-video w-full object-cover rounded-md sm:aspect-square"
        />
      ) : (
        <div
          className="
            aspect-video w-full bg-stone-300 rounded-md sm:aspect-square
            grid place-items-center
          "
        >
          <Loading size="lg" className="text-stone-50" />
        </div>
      )}

      <Form.Input
        type="hidden"
        name="imageUrl"
        id="imageUrl"
        value={imageUrl ?? ''}
      />
      <LoadingButton
        onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          clearAllErrors();
          openFile?.();
        }}
        loading={fetcher.state !== 'idle'}
      >
        Upload image
      </LoadingButton>

      {fetcher.data && isErrorResponse(fetcher.data) ? (
        <p className="text-xs text-red-500">
          {fetcher.data.fieldErrors.file || ' '}
        </p>
      ) : null}
    </div>
  );
}
