import Avatar from '~/components/ui/Avatar';
import Form from '~/components/ui/Form';

import { PLACEHOLDER_IMAGE_URL } from '~/utils/constants';

interface ImageUploadProps {
  imageUrl: string | null;
  defaultImageUrl: string | null;
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;

  imageClassName?: string;
}

export default function AvatarUpload({
  imageUrl,
  defaultImageUrl,
  setImageUrl,
  imageClassName,
}: ImageUploadProps) {
  const onUploadImage = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files ? ev.target.files[0] : null;
    if (file) setImageUrl(URL.createObjectURL(file));
  };

  return (
    <>
      <button
        onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const target = ev.target as HTMLButtonElement;
          (target.nextSibling as HTMLInputElement).click();
        }}
      >
        <Avatar
          src={imageUrl ?? defaultImageUrl ?? PLACEHOLDER_IMAGE_URL}
          alt=""
          size="xl"
          className="pointer-events-none"
        />
      </button>

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
