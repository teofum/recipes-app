import Form from '~/components/ui/Form';
import Button from '../ui/Button';

import { PLACEHOLDER_IMAGE_URL } from '~/utils/constants';

interface ImageUploadProps {
  imageUrl: string | null;
  defaultImageUrl: string | null;
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ImageUpload({
  imageUrl,
  defaultImageUrl,
  setImageUrl,
}: ImageUploadProps) {
  const onUploadImage = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files ? ev.target.files[0] : null;
    if (file) setImageUrl(URL.createObjectURL(file));
  };

  return (
    <>
      <img
        src={imageUrl ?? defaultImageUrl ?? PLACEHOLDER_IMAGE_URL}
        alt=" "
        className="aspect-video w-full object-cover rounded-md sm:aspect-square"
      />

      <Button
        onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const target = ev.target as HTMLButtonElement;
          (target.nextSibling as HTMLInputElement).click();
        }}
      >
        Upload image
      </Button>

      <Form.Input
        type="file"
        name="image"
        id="image"
        className="hidden"
        onChange={onUploadImage}
      />
      <Form.Error name="image" id="image" />
    </>
  );
}
